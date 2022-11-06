import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ResponseParams } from 'src/utils/response';
import { RoomCreateModel, RoomDelModel, RoomUserCreateModel } from './room.dto';
import { RoomService } from './room.service';

@ApiTags('群模块')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ summary: '新建群聊' })
  @ApiBody({ type: RoomCreateModel })
  @Post('/createRoom')
  @UseGuards(AuthGuard)
  async createRoom(@Req() req, @Body() params: RoomCreateModel) {
    const userId = req.user.userId;
    params.userId = userId;
    const info = await this.roomService.create(params);
    return { data: info };
  }

  @ApiOperation({ summary: '添加群成员' })
  @ApiBody({ type: RoomUserCreateModel })
  @Post('/createRoomUser')
  @UseGuards(AuthGuard)
  async createRoomUser(@Req() req, @Body() params: RoomUserCreateModel) {
    const userId = req.user.userId;
    params.userId = userId;
    const info = await this.roomService.createUser(params);
    return { data: info };
  }

  @ApiOperation({ summary: '解散群聊' })
  @ApiBody({ type: RoomCreateModel })
  @Post('/delRoom')
  @UseGuards(AuthGuard)
  async delRoom(@Req() req, @Body() params: RoomDelModel): Promise<ResponseParams> {
    const userId = req.user.userId;
    await this.roomService.del(params.roomId, userId);
    return { message: '解散成功！' };
  }
}
