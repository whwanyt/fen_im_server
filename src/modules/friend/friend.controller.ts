import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { FriendAddDTO, FriendConsentDTO, FriendSearchDTO } from './friend.dto';
import { FriendGateway } from './friend.gateway';
import { FriendService } from './friend.service';

@ApiTags('好友模块')
@Controller('friend')
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
    private readonly friendGateway: FriendGateway,
  ) {}

  @ApiOperation({ summary: '好友列表' })
  @Post('list')
  @UseGuards(AuthGuard)
  async getList(@Req() req) {
    const userId = req.user.userId;
    const data = await this.friendService.getList({ userId });
    return { data };
  }

  @ApiOperation({ summary: '待添加好友列表' })
  @Post('addList')
  @UseGuards(AuthGuard)
  async getAddList(@Req() req) {
    const userId = req.user.userId;
    const data = await this.friendService.getAddList({ userId });
    return { data };
  }

  @ApiOperation({ summary: '好友搜索' })
  @ApiBody({ type: FriendSearchDTO })
  @Post('search')
  async searchList(@Body() params: FriendSearchDTO) {
    const data = await this.friendService.searchList(params);
    return { data };
  }

  @ApiOperation({ summary: '同意好友申请' })
  @ApiBody({ type: FriendConsentDTO })
  @Post('consent')
  @UseGuards(AuthGuard)
  async consent(@Req() req, @Body() params: FriendConsentDTO) {
    const userId = req.user.userId;
    params.userId = userId;
    await this.friendService.consent(params);
    this.friendGateway.sendFriendList(userId);
    this.friendGateway.sendFriendList(params.friendId);
    return { message: true };
  }

  @ApiOperation({ summary: '添加好友' })
  @ApiBody({ type: FriendAddDTO })
  @Post('add')
  @UseGuards(AuthGuard)
  async add(@Req() req, @Body() params: FriendAddDTO) {
    const userId = req.user.userId;
    params.userId = userId;
    this.friendGateway.hintFriend(params.friendId);
    const data = await this.friendService.addFriend(params);
    return { data };
  }
}
