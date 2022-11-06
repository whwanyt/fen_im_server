import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import jwt = require('jsonwebtoken');
import { AuthGuard } from 'src/auth/auth.guard';
import config from 'src/config/config';
import { ResponseParams } from 'src/utils/response';
import { UserCreateDTO, UserLoginDTO, UserUpdatePasdDTO } from './user.dto';
import { UserService } from './user.service';

@ApiTags('用户模块')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('list')
  @UseGuards(AuthGuard)
  async list() {
    const list = await this.usersService.list();
    return { data: list };
  }

  @ApiOperation({ summary: '登录' })
  @ApiBody({ type: UserLoginDTO })
  @Post('login')
  async login(@Body() params: UserLoginDTO): Promise<ResponseParams> {
    const info = await this.usersService.login(params);
    const token = jwt.sign(
      {
        userId: info.id,
        userName: info.userName,
      },
      config.keys,
      { expiresIn: '24h' },
    );
    return {
      data: {
        userName: info.userName,
        avatar: info.avatar,
        label: info.label,
        email: info.email,
        id: info.id,
        token: token,
      },
    };
  }

  @ApiOperation({ summary: '注册' })
  @ApiBody({ type: UserCreateDTO })
  @Post('create')
  async created(@Body() params: UserCreateDTO): Promise<ResponseParams> {
    const info = await this.usersService.created(params);
    return { data: info };
  }

  @ApiOperation({ summary: '修改密码' })
  @ApiBody({ type: UserUpdatePasdDTO })
  @Post('updatedPasd')
  @UseGuards(AuthGuard)
  async updatedPasd(@Req() req, @Body() params: UserUpdatePasdDTO): Promise<ResponseParams> {
    const userId = req.user.userId;
    await this.usersService.updatePasd(userId, params);
    return { message: '成功' };
  }
}
