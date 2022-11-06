import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from './user.model';

@Entity()
export class Friend {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => User)
  @JoinColumn()
  user: User;

  @OneToOne((type) => User)
  @JoinColumn()
  friend: User;

  //0:待添加，1：已添加，2：已删除
  @Column({default:0})
  statue: number;

  @Column({default:1})
  type:number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn({})
  updatedDate: Date;

}
