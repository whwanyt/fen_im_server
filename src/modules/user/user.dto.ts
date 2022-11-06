import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserLoginDTO {
  @ApiProperty({ default: '2956860463@qq.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ default: '123456' })
  @IsNotEmpty()
  readonly password: string;
}

export class UserCreateDTO {
  @ApiProperty({ default: '2956860463@qq.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ default: '123456' })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  readonly role: number;

  @ApiProperty({ default: '随风' })
  @IsNotEmpty()
  readonly userName: string;
}

export class UserUpdatePasdDTO{

  @ApiProperty({ default: '123456' })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ default: '1234567' })
  @IsNotEmpty()
  readonly nPassword: string;
}
