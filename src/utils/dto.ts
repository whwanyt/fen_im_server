import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ListDTO {
  @ApiProperty({ default: 1 })
  @IsNumber()
  pageNum?: number;

  @ApiProperty({ default: 10 })
  @IsNumber()
  pageSize?: number;

  @ApiProperty({ default: 1, description: '排序规则: 1.正序/2.倒序' })
  @IsNumber()
  sort?: number;
}
