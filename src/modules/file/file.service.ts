import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from '../../model/attachment.model';
import { Repository } from 'typeorm';
import { FileDelDTO, FileListDTO } from './file.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Attachment, 'upload')
    private attachmentRepository: Repository<Attachment>,
  ) {}

  async getList(options: FileListDTO, userId: number) {
    const skip = options.pageNum * options.pageSize - options.pageSize;
    let where: { type?: string; userId: number } = { type: options.type, userId: userId };
    if (options.type === 'default') {
      where = { userId: userId };
    }
    const list = await this.attachmentRepository.find({
      where,
      skip,
      take: options.pageSize,
    });
    const count = await this.attachmentRepository.count({
      where,
    });
    return { count, list };
  }

  async create(options: Attachment) {
    const info = await this.attachmentRepository.save(options);
    return info;
  }

  async findMd5(hash: string) {
    const info = await this.attachmentRepository.findOne({ where: { md5: hash } });
    return info;
  }

  async delete(options: FileDelDTO) {
    const info = await this.attachmentRepository.findOne({ where: { id: options.id } });
    await this.attachmentRepository.delete(info);
    return info;
  }
}
