import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  userId: number;

  @Column()
  friendId: number;

  @Column({ type: 'text' })
  content: string;

  // 1:未读，2：已读
  @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  createTime?: string;

  @UpdateDateColumn()
  updateTime?: string;
}
