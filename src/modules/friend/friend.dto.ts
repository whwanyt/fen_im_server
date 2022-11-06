import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class FriendAddDTO {
  userId: number;
  @ApiProperty({ default: '1' })
  @IsNotEmpty()
  friendId: number;
}

export class FriendSearchDTO{
  @ApiProperty({ default: '2956860463@qq.com' })
  @IsEmail()
  email:string;
}

export class FriendConsentDTO {
  userId: number;
  @ApiProperty({ default: '1' })
  @IsNotEmpty()
  friendId: number;
}

export class FriendListDTO {
  userId: number;
}

export class FriendUser {
  id: number;
  userName: string;
  avatar: string;
  label: string;
}
