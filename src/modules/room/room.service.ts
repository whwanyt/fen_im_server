import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/model/room.model';
import { RoomUser } from 'src/model/roomUser.model';
import { User } from 'src/model/user.model';
import { DataSource, Repository } from 'typeorm';
import { RoomCreateModel, RoomUserCreateModel } from './room.dto';

@Injectable()
export class RoomService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RoomUser)
    private roomUserRepository: Repository<RoomUser>,
  ) {}

  async getRoomList(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const list = await this.roomUserRepository
      .createQueryBuilder('room_user')
      .leftJoinAndSelect('room_user.room', 'room as room_r')
      .where(`room_user.userId = ${userId} And room_user.statue = 1`)
      .getMany();
    return list.map((item) => {
      return item.room;
    });
  }

  async create(options: RoomCreateModel) {
    const info = new Room();
    info.name = options.name;
    info.label = options.label;
    info.user = await this.userRepository.findOne({ where: { id: options.userId } });
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const res = await this.roomRepository.save(info);
      await this.createUser({
        userId: options.userId,
        owner: true,
        roomId: res.id,
        friendId: options.userId,
      });
      await queryRunner.commitTransaction();
      return res;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException('服务异常', HttpStatus.FORBIDDEN);
    }
  }

  async findOne(roomId: number) {
    return this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.user', 'user as user_u')
      .where(`room.id = ${roomId}`)
      .getOne();
  }

  async del(roomId: number, userId: number) {
    const room = await this.findOne(roomId);
    if (userId != room.user.id) {
      throw new HttpException('你不是群主还想解散', HttpStatus.FORBIDDEN);
    }
    await this.roomRepository.update(roomId, { statue: 2 });
  }

  async createUser(options: RoomUserCreateModel) {
    const room = await this.findOne(options.roomId);
    if (!room) {
      throw new HttpException('群不存在', HttpStatus.FORBIDDEN);
    }
    if (options.userId != room.user.id) {
      throw new HttpException('只有群主可以添加群成员', HttpStatus.FORBIDDEN);
    }
    const item = await this.roomUserRepository
      .createQueryBuilder('room_user')
      .where(`room_user.room = ${options.roomId} And room_user.user = ${options.friendId}`)
      .getOne();
    if (item) {
      throw new HttpException('已经是群成员了', HttpStatus.FORBIDDEN);
    }
    const user = await this.userRepository.findOne({ where: { id: options.friendId } });
    if (!user) {
      throw new HttpException('该用户不存在', HttpStatus.FORBIDDEN);
    }
    const info = new RoomUser();
    info.room = room;
    info.user = user;
    info.statue = 1;
    try {
      return await this.roomUserRepository.save(info);
    } catch (error) {
      console.log(error);
    }
  }

  async getRoomUsers(roomId: number, statue: number) {
    const room = await this.findOne(roomId);
    const list = await this.roomUserRepository.find({ where: { room, statue } });
    return list;
  }
}
