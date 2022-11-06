import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { passwordHash, passwordVerify } from 'src/utils/pasd.utils';
import { Repository } from 'typeorm';
import { Role } from '../../model/role.model';
import { User } from '../../model/user.model';
import { UserCreateDTO, UserLoginDTO, UserUpdatePasdDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async login(options: UserLoginDTO) {
    const info = await this.usersRepository.findOne({
      where: { email: options.email },
      select: { id: true, password: true, userName: true, avatar: true, label: true },
    });
    if (!info) {
      throw new HttpException('email not found', HttpStatus.FORBIDDEN);
    }
    const statu = passwordVerify(options.password, info.password);
    if (!statu) {
      throw new HttpException('password not found', HttpStatus.FORBIDDEN);
    }
    return info;
  }

  async list() {
    const list = await this.usersRepository.find();
    return list;
  }

  async created(options: UserCreateDTO) {
    const role = await this.roleRepository.findOne({ where: { id: options.role } });
    if (!role) {
      throw new HttpException('role not found', HttpStatus.NOT_FOUND);
    }
    const email = await this.usersRepository.findOne({ where: { email: options.email } });
    if (email) {
      throw new HttpException('email already exist', HttpStatus.UNAUTHORIZED);
    }
    const info = this.usersRepository.save({
      email: options.email,
      userName: options.userName,
      password: passwordHash(options.password),
      role: role,
    });
    return info;
  }

  async updatePasd(userId: number, options: UserUpdatePasdDTO) {
    const info = await this.usersRepository.findOne({
      where: { id: userId },
      select: { password: true },
    });
    const statu = passwordVerify(options.password, info.password);
    if (!statu) {
      throw new HttpException('password not found', HttpStatus.FORBIDDEN);
    }
    await this.usersRepository.update(userId, { password: passwordHash(options.nPassword) });
  }

  async findOne(email: string) {
    return await this.usersRepository.findOne({ where: { email: email } });
  }
}
