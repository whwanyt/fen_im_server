import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/model/role.model';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleService],
  controllers: [RoleController]
})
export class RoleModule {}
