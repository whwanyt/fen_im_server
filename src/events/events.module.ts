import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from 'src/model/friend.model';
import { Message } from 'src/model/message.model';
import { Room } from 'src/model/room.model';
import { RoomMessage } from 'src/model/roomMessage.model';
import { RoomUser } from 'src/model/roomUser.model';
import { User } from 'src/model/user.model';
import { FriendService } from 'src/modules/friend/friend.service';
import { RoomService } from 'src/modules/room/room.service';
import { EventsGateway } from './events.gateway';
import { FriendMessageService } from './friendMessage.service';
import { RoomMessageService } from './roomMessage.service';
@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Friend, Room, RoomUser, RoomMessage])],
  providers: [EventsGateway, FriendMessageService, FriendService, RoomService, RoomMessageService],
  exports: [EventsGateway],
})
export class EventsModule {}
