import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Room } from './room.model';
import { User } from './user.model';

@Entity()
export class RoomUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Room, (room) => room.id)
  room: Room;

  //0：待同意加入 1：已加入 2:已退出
  @Column({ default: 0 })
  statue: number;

  @Column({ default: false })
  owner: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn({})
  updatedDate: Date;
}
