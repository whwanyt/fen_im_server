import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Express } from 'express';
import * as fs from 'fs-extra';
import * as path from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { fileHashMd5 } from 'src/utils/fileMd5';
import { getFileType } from 'src/utils/fileType';
import {
  FileFileDTO,
  FileChunkFileDTO,
  FileExistFileDTO,
  FileMergeFileDTO,
  FileListDTO,
  FileDelDTO,
} from './file.dto';
import { FileService } from './file.service';
const basePath = '/upload/file';
const delPath = '/upload/delete';
const STATIC_FILES = path.join(process.cwd(), basePath);
const STATIC_TEMPORARY = path.join(process.cwd(), '/upload/temporary');

@ApiTags('文件上传')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: '获取文件列表' })
  @ApiBody({ type: FileListDTO })
  @Post('list')
  @UseGuards(AuthGuard)
  async getList(@Req() req, @Body() params: FileListDTO) {
    const userId = req.user.userId;
    const data = await this.fileService.getList(params, userId);
    return { data };
  }

  @ApiOperation({ summary: '删除文件' })
  @ApiBody({ type: FileDelDTO })
  @Post('delete')
  @UseGuards(AuthGuard)
  async delFile(@Body() params: FileDelDTO) {
    const info = await this.fileService.delete(params);
    fs.moveSync(
      path.join(process.cwd(), info.url),
      path.join(process.cwd(), delPath, `${info.md5}${info.extname}`),
    );
    return { message: '删除成功' };
  }

  @ApiOperation({ summary: '单文件上传' })
  @ApiBody({ type: FileFileDTO })
  @ApiConsumes('multipart/form-data')
  @Post('singleFile')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async singleFile(@Req() req, @UploadedFile() file: Express.Multer.File) {
    try {
      console.log(file);
      const userId = req.user.userId;
      const extname = path.extname(file.originalname);
      const md5 = fileHashMd5(file.buffer);
      const lInfo = await this.fileService.findMd5(md5);
      if (lInfo) {
        return { message: '文件存在', data: lInfo };
      }
      fs.writeFileSync(path.join(STATIC_FILES, `${md5}${extname}`), file.buffer);
      const url = basePath + `/${md5}${extname}`;
      const info = await this.fileService.create({
        filename: file.originalname,
        url: url,
        md5: md5,
        userId: userId,
        type: getFileType(extname),
        extname: extname,
      });
      return { data: info };
    } catch (error) {
      console.log(error);
    }
  }

  @ApiOperation({ summary: '切片上传' })
  @ApiBody({ type: FileChunkFileDTO })
  @Post('chunkFile')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  chunkFile(@Body() params: FileChunkFileDTO, @UploadedFile() file: Express.Multer.File) {
    const { filename, hash, fileHash } = params;
    const dir = path.join(STATIC_TEMPORARY, `${fileHash}`);
    const target = path.join(STATIC_TEMPORARY, `${fileHash}/${hash}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    const isFile = fs.existsSync(target);
    if (!isFile) {
      try {
        fs.writeFileSync(target, file.buffer);
        return { message: '上传成功!' };
      } catch (error) {
        throw error;
      }
    } else {
      return { message: '上传成功!' };
    }
  }

  @ApiOperation({ summary: '文件存在Hash验证' })
  @ApiBody({ type: FileExistFileDTO })
  @Get('existFile')
  @UseGuards(AuthGuard)
  async existFile(@Query() params: FileExistFileDTO) {
    const info = await this.fileService.findMd5(params.hash);
    return { data: info };
  }

  @ApiOperation({ summary: '文件合并' })
  @ApiBody({ type: FileMergeFileDTO })
  @Get('merge')
  @UseGuards(AuthGuard)
  async merge(@Req() req, @Query() params: FileMergeFileDTO) {
    const { filename, hash } = params;
    const userId = req.user.userId;
    const extname = path.extname(filename).toLowerCase();
    const filePath = path.join(STATIC_FILES, `${hash}${extname}`);
    const dir = path.join(STATIC_TEMPORARY, `${hash}`);
    if (!fs.existsSync(filePath)) {
      try {
        const ws = fs.createWriteStream(filePath);
        fs.readdirSync(dir).map((blob, index) => {
          const buffer = fs.readFileSync(`${STATIC_TEMPORARY}/${hash}/${hash}-${index}`);
          ws.write(buffer);
        });
        ws.close();
        fs.removeSync(dir);
        const url = basePath + `/${hash}${extname}`;
        const info = await this.fileService.create({
          filename: filename,
          url: url,
          md5: hash,
          userId: userId,
          type: getFileType(extname),
          extname: extname,
        });
        if (fs.existsSync(dir)) {
          fs.removeSync(dir);
        }
        return { data: info };
      } catch (error) {
        if (fs.existsSync(filePath)) {
          fs.removeSync(filePath);
        }
        throw error;
      }
    } else {
      const info = await this.fileService.findMd5(hash);
      return { data: info };
    }
  }
}
