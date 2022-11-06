import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import jwt = require('jsonwebtoken');
import config from 'src/config/config';
import { EventsLoginDTO, EventsLogoutDTO, FriendModel, MessageModel, MsgListDTO, RoomMessageModel } from './events.dto';
import { Cache } from 'cache-manager';
import { FriendMessageService } from './friendMessage.service';
import { Message } from 'src/model/message.model';
import { FriendService } from 'src/modules/friend/friend.service';
import { RoomService } from 'src/modules/room/room.service';
import { RoomMessageService } from './roomMessage.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @Inject(CACHE_MANAGER)
  private cacheManager: Cache;

  constructor(
    private readonly friendMessageService: FriendMessageService,
    private readonly roomMessageService: RoomMessageService,
    private readonly friendService: FriendService,
    private readonly roomService: RoomService,
  ) {}

  private readonly logger = new Logger('Events');

  handleConnection(socket: Socket) {
    try {
      this.logger.log(`[链接成功] ${socket.id}`);
    } catch (error) {
      console.log(error);
    }
  }

  handleDisconnect(socket: Socket) {
    try {
      this.cacheManager.get(socket.id).then((res) => {
        if (res) {
          this.cacheManager.del(res['userId']);
          this.logger.log(`[离线] ${res['userName']}`);
        }
        this.cacheManager.del(socket.id);
        this.logger.log(`[链接已断开] ${socket.id}`);
      });
      socket.disconnect();
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('login')
  async login(@ConnectedSocket() client: Socket, @MessageBody() data: EventsLoginDTO) {
    try {
      const decode = jwt.verify(data.token, config.keys);
      const userId = decode['userId'];
      this.cacheManager.set(userId.toString(), client.id, { ttl: 24 * 3600 });
      this.cacheManager.set(client.id, decode, { ttl: 24 * 3600 });
      this.logger.log(`[上线] ${decode['userName']} ${client.id}`);
      const res: FriendModel[] = await this.friendService.getList({ userId: decode['userId'] });
      let list = [];
      for (const iterator of res) {
        const item = await this.friendMessageService.getLatelyMsg(iterator.friend.id, iterator.user.id);
        list.push({ ...iterator, latelyMsg: item });
      }
      client.emit('friend-list', list);
    } catch (error) {
      throw new WsException('token not found');
    }
  }

  @SubscribeMessage('friend-list')
  async friendList(@ConnectedSocket() client: Socket) {
    const decode = await this.cacheManager.get(client.id);
    if (!decode) {
      return new WsException('token not found');
    }
    const userId = decode['userId'];
    const res: FriendModel[] = await this.friendService.getList({ userId });
    let list = [];
    for (const iterator of res) {
      const item = await this.friendMessageService.getLatelyMsg(iterator.friend.id, iterator.user.id);
      list.push({ ...iterator, latelyMsg: item });
    }
    client.emit('friend-list', res);
  }

  @SubscribeMessage('room-list')
  async roomList(@ConnectedSocket() client: Socket) {
    try {
      const decode = await this.cacheManager.get(client.id);
      if (!decode) {
        return new WsException('token not found');
      }
      const userId = decode['userId'];
      const roomList = await this.roomService.getRoomList(userId);
      client.emit('room-list', roomList);
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('logout')
  async logout(@ConnectedSocket() client: Socket, @MessageBody() data: EventsLogoutDTO) {
    try {
      const decode = jwt.verify(data.token, config.keys);
      this.cacheManager.del(decode['userId'].toString());
      this.cacheManager.del(client.id);
      this.logger.log(`[退出登录] ${decode['userName']}`);
    } catch (error) {
      throw new WsException('token not found');
    }
  }

  @SubscribeMessage('get-list')
  async getMessage(@ConnectedSocket() client: Socket, @MessageBody() data: MsgListDTO) {
    const decode = await this.cacheManager.get(client.id);
    if (!decode) {
      return new WsException('token not found');
    }
    const userId = decode['userId'];
    const list = await this.friendMessageService.getList(data, userId);
    client.emit('get-list', list);
  }

  @SubscribeMessage('message')
  async chatMessage(@ConnectedSocket() client: Socket, @MessageBody() data: MessageModel) {
    const friend = await this.cacheManager.get<string>(data.friendId.toString());
    let res: Message;
    if (friend) {
      res = await this.friendMessageService.created(data, 2);
      this.server.to(friend).emit('message', {
        content: JSON.parse(res.content),
        friendId: res.friendId,
        userId: res.userId,
      } as MessageModel);
    } else {
      res = await this.friendMessageService.created(data, 1);
    }
    client.emit('message', {
      content: JSON.parse(res.content),
      friendId: res.friendId,
      userId: res.userId,
    } as MessageModel);
  }

  @SubscribeMessage('room-message')
  async roomMessage(@ConnectedSocket() client: Socket, @MessageBody() data: RoomMessageModel) {
    const users = await this.roomService.getRoomUsers(data.roomId, 1);
    const res = await this.roomMessageService.created(data, 2);
    for (const iterator of users) {
      const friend = await this.cacheManager.get<string>(iterator.id.toString());
      if (friend) {
        this.server.to(friend).emit('message', {
          content: JSON.parse(res.content),
          roomId: res.roomId,
          userId: res.userId,
        } as RoomMessageModel);
      }
    }
    client.emit('room-message', {
      content: JSON.parse(res.content),
      userId: res.userId,
    } as RoomMessageModel);
  }
}
