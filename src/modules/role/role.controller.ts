import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleListDTO, RoleCreateDTO, RoleUpdateDTO } from './role.dto';
import { RoleService } from './role.service';

@ApiTags('角色模块')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: '列表' })
  @Get('/')
  // @UseGuards(AuthGuard)
  async index(@Query() params: RoleListDTO) {
    const list = await this.roleService.getList(params);
    return { data: list };
  }

  @ApiOperation({ summary: '新增角色' })
  @ApiBody({ type: RoleCreateDTO })
  @Post('/create')
  @UseGuards(AuthGuard)
  async create(@Body() params: RoleCreateDTO) {
    const info = await this.roleService.create(params);
    return { data: info };
  }

  @ApiOperation({ summary: '更新角色' })
  @ApiBody({ type: RoleUpdateDTO })
  @Post('/update')
  @UseGuards(AuthGuard)
  async update(@Body() params: RoleUpdateDTO) {
    const info = await this.roleService.update(params);
    return { data: info };
  }
}
