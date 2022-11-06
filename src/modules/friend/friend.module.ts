import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from 'src/model/friend.model';
import { User } from 'src/model/user.model';
import { FriendController } from './friend.controller';
import { FriendGateway } from './friend.gateway';
import { FriendService } from './friend.service';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, User])],
  providers: [FriendService, FriendGateway],
  controllers: [FriendController],
  exports: [FriendService],
})
export class FriendModule {}
