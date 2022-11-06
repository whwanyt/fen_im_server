import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailSendCodeDTO {
  @ApiProperty({ default: '2956860463@qq.com', description: '邮箱' })
  @IsEmail()
  email: string;
}
