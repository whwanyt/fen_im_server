import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Attachment {
  @ObjectIdColumn()
  id?: string;

  @Column()
  url: string;

  @Column({ default: null })
  userId?: number;

  @Column()
  filename: string;

  @Column()
  md5: string;

  @Column()
  extname: string;

  @Column()
  type: string;

  @Column({ default: '' })
  extra?: string;

  @CreateDateColumn()
  createTime?: string;

  @UpdateDateColumn()
  updateTime?: string;
}
