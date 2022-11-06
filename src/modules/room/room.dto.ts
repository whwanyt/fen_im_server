import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RoomCreateModel {
  userId: number;

  @ApiProperty({ default: '测试一群' })
  @IsNotEmpty()
  name: string;
  @ApiProperty({ default: '' })
  label: string;
}

export class RoomInfoModel {
  @ApiProperty({ default: '1' })
  @IsNumber()
  roomId: number;
}

export class RoomDelModel {
  @ApiProperty({ default: '1' })
  @IsNumber()
  roomId: number;
}

export class RoomUserDel {
  @ApiProperty({ default: '1' })
  @IsNumber()
  userId: number;
}

export class RoomUserCreateModel {
  userId: number;
  owner: boolean;

  @ApiProperty({ default: 1 })
  @IsNumber()
  roomId: number;

  @ApiProperty({ default: 1 })
  @IsNumber()
  friendId: number;
}
