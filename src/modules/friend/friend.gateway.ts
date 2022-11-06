import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FriendGateway {
  @WebSocketServer()
  server: Server;

  @Inject(CACHE_MANAGER)
  private cacheManager: Cache;

  private readonly logger = new Logger('Events');

  async sendFriendList(friendId: number) {
    const friendSocketId = await this.cacheManager.get<string>(friendId.toString());
    friendSocketId && this.server.to(friendSocketId).emit('up-friend-list', {});
  }

  async hintFriend(friendId: number) {
    const friendSocketId = await this.cacheManager.get<string>(friendId.toString());
    friendSocketId && this.server.to(friendSocketId).emit('up-friend-add', {});
  }
}
