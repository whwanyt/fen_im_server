import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomMessage } from 'src/model/roomMessage.model';
import { User } from 'src/model/user.model';
import { Repository } from 'typeorm';
import { RoomMessageModel } from './events.dto';

@Injectable()
export class RoomMessageService {
  constructor(
    @InjectRepository(RoomMessage)
    private roomMessageRepository: Repository<RoomMessage>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async created(messgae: RoomMessageModel, status: number = 1) {
    const msg = new RoomMessage();
    msg.content = JSON.stringify(messgae.content);
    msg.userId = messgae.userId;
    msg.roomId = messgae.roomId;
    msg.status = status;
    const info = await this.roomMessageRepository.save(msg);
    // const user = await this.userRepository.findOne({ where: { id: messgae.userId } });
    // const friend = await this.userRepository.findOne({ where: { id: messgae.friendId } });
    return info;
  }
}
