import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class RoomMessage {
  @PrimaryGeneratedColumn()
  id?: string;

  //对应用户
  @Column()
  userId: number;

  //房间ID
  @Column()
  roomId: number;

  @Column({ type: 'text' })
  content: string;

  // !待优化 1:未读，2：已读
  @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  createTime?: string;

  @UpdateDateColumn()
  updateTime?: string;
}
