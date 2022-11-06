import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.model';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  label: string;

  @Column({ default: '' })
  avatar: string;

  @OneToOne((type) => User)
  @JoinColumn()
  user: User;

  //1：已存在，2：已删除
  @Column({ default: 1 })
  statue: number;

  //群类型
  @Column({ default: 1 })
  type: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn({})
  updatedDate: Date;
}
