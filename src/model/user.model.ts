import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Role } from './role.model';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, default: null })
  phone: string;

  @Exclude({ toClassOnly: true, toPlainOnly: true })
  @Column({ select: false })
  password: string;

  @Column({ default: '' })
  avatar: string;

  @Column({ default: '' })
  label: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Role, (role) => role.id)
  role: Role;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
