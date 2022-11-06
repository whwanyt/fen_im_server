import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../model/user.model';
import { Role } from '../../model/role.model';

@Module({
  imports: [TypeOrmModule.forFeature([User,Role])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
