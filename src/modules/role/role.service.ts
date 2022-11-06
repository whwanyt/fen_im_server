import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../model/role.model';
import { RoleListDTO, RoleCreateDTO, RoleUpdateDTO } from './role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getList(options:RoleListDTO){
    const skip = options.pageSize * options.pageNum - options.pageSize;
    const sort = options.sort === 2 ? "ASC" : "DESC"
    const list = await this.roleRepository
      .createQueryBuilder("role")
      .orderBy("role.id", sort)
      .skip(skip)
      .take(options.pageSize)
      .getMany();
    return list;
  }

  async create(option:RoleCreateDTO){
    return await this.roleRepository.save(option)
  }

  async update(option:RoleUpdateDTO){
    const role = await this.roleRepository.findOne({where:{id:option.id}})
    if(!role){
      throw new HttpException('role not found', HttpStatus.NOT_FOUND);
    }
    return this.roleRepository.update(option.id,option)
  }

  async removes(id:number){
    const role = await this.roleRepository.findOne({where:{id}})
    if(!role){
      throw new HttpException('role not found', HttpStatus.NOT_FOUND);
    }
    return await this.roleRepository.delete(id)
  }

  async find(id:number){
    const role = await this.roleRepository.findOne({where:{id}})
    if(!role){
      throw new HttpException('role not found', HttpStatus.NOT_FOUND);
    }
    return role;
  }

}