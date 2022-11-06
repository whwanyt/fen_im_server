import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from 'src/model/friend.model';
import { User } from 'src/model/user.model';
import { Repository } from 'typeorm';
import { FriendAddDTO, FriendListDTO, FriendSearchDTO, FriendConsentDTO } from './friend.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getInfo(userId: number, friendId: number) {
    const item = await this.friendRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.user', 'user as user_u')
      .leftJoinAndSelect('friend.friend', 'user as user_f')
      .where(`friend.user = ${userId} And friend.friend = ${friendId}`)
      .orWhere(`friend.user = ${friendId} And friend.friend = ${userId}`)
      .getOne();
    return item;
  }

  async searchList(options: FriendSearchDTO) {
    const list = await this.userRepository.find({ where: { email: options.email } });
    return list;
  }

  async addFriend(options: FriendAddDTO) {
    let item: Friend;
    const getInfo = await this.getInfo(options.userId, options.friendId);
    if (getInfo) {
      throw new HttpException('已经是好友了', HttpStatus.FORBIDDEN);
    }
    const user = await this.userRepository.findOne({ where: { id: options.userId } });
    const friend = await this.userRepository.findOne({ where: { id: options.friendId } });
    if (!friend) {
      throw new HttpException('用户不存在', HttpStatus.FORBIDDEN);
    }
    const info = new Friend();
    info.user = user;
    info.friend = friend;
    info.statue = 0;
    item = await this.friendRepository.save(info);
    return item;
  }

  async consent(options: FriendConsentDTO) {
    const info = await this.getInfo(options.userId, options.friendId);
    if (info) {
      info.statue = 1;
      await this.friendRepository.update(info.id, info);
      return true;
    }
    throw new HttpException('friend not found', HttpStatus.FORBIDDEN);
  }

  async getList(option: FriendListDTO) {
    
    const list = await this.friendRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.user', 'user as user_u')
      .leftJoinAndSelect('friend.friend', 'user as user_f')
      .where(`friend.user = ${option.userId} And friend.statue = 1`)
      .orWhere(`friend.friend = ${option.userId} And friend.statue = 1`)
      .getMany();
    let nList = [];

    for (const item of list) {
      if (item.user.id != option.userId) {
        const info = item.user;
        item.user = item.friend;
        item.friend = info;
      }
      nList.push(item);
    }
    return nList;
  }

  async getAddList(option: FriendListDTO) {
    const list = await this.friendRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.user', 'user as user_u')
      .leftJoinAndSelect('friend.friend', 'user as user_f')
      .where(`friend.friend = ${option.userId} And friend.statue = 0`)
      .getMany();
    return list;
  }
}
