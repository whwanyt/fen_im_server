import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { Attachment } from 'src/model/attachment.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Attachment], 'upload')],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
