import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/model/message.model';
import { User } from 'src/model/user.model';
import { Repository } from 'typeorm';
import { MessageModel, MsgListDTO } from './events.dto';

@Injectable()
export class FriendMessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async created(messgae: MessageModel, status: number = 1) {
    const msg = new Message();
    msg.content = JSON.stringify(messgae.content);
    msg.userId = messgae.userId;
    msg.friendId = messgae.friendId;
    msg.status = status;
    const info = await this.messageRepository.save(msg);
    // const user = await this.userRepository.findOne({ where: { id: messgae.userId } });
    // const friend = await this.userRepository.findOne({ where: { id: messgae.friendId } });
    return info;
  }

  async getLatelyMsg(friendId: number, userId: number) {
    const info = await this.messageRepository
      .createQueryBuilder('message')
      .where(`message.userId = ${userId} And message.friendId = ${friendId}`)
      .orWhere(`message.friendId = ${userId} And message.userId = ${friendId}`)
      .orderBy('message.id', 'DESC')
      .getOne();
    info && (info.content = JSON.parse(info.content));
    return info;
  }

  async getUnreadMsg(friendId: number, userId: number) {
    const count = await this.messageRepository
      .createQueryBuilder('message')
      .where(`message.userId = ${userId} And message.friendId = ${friendId} And message.status = 1`)
      .orWhere(`message.friendId = ${userId} And message.userId = ${friendId} And message.status = 1`)
      .getCount();
    return count;
  }

  async getList(options: MsgListDTO, userId: number) {
    const skip = options.pageSize * options.pageNum - options.pageSize;
    const sort = options.sort === 2 ? 'ASC' : 'DESC';
    const listAndCount = await this.messageRepository
      .createQueryBuilder('message')
      .where(`message.userId = ${userId} And message.friendId = ${options.friendId}`)
      .orWhere(`message.friendId = ${userId} And message.userId = ${options.friendId}`)
      .orderBy('message.id', sort)
      .skip(skip)
      .take(options.pageSize)
      .getManyAndCount();
    return { list: listAndCount[0], count: listAndCount[1] };
  }
}
