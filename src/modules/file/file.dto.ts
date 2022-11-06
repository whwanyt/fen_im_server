import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ListDTO } from 'src/utils/dto';

export class FileChunkFileDTO {
  @ApiProperty()
  @IsNotEmpty()
  hash: string;

  @ApiProperty()
  @IsNotEmpty()
  filename: string;

  @ApiProperty()
  @IsNotEmpty()
  size: string;

  @ApiProperty()
  @IsNotEmpty()
  fileHash: string;
}

export class FileMergeFileDTO {
  @ApiProperty()
  @IsNotEmpty()
  hash: string;

  @ApiProperty()
  @IsNotEmpty()
  filename: string;
}

export class FileExistFileDTO {
  @ApiProperty()
  @IsNotEmpty()
  hash: string;
}

export class FileDelDTO {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}

export class FileFileDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  file: any;
}

export class FileListDTO extends ListDTO {
  @ApiProperty({ default: 'default' })
  @IsNotEmpty()
  type: string;
}
