import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinTable } from 'typeorm';
import { User } from './user.model';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  label: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => User, user => user.role)
  users:User[]

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
