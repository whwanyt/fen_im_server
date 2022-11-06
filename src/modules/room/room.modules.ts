import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/model/room.model';
import { RoomUser } from 'src/model/roomUser.model';
import { User } from 'src/model/user.model';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomUser, User])],
  providers: [RoomService],
  controllers: [RoomController],
})
export class RoomModule {}
