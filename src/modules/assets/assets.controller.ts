import { Controller, Get, Header, Headers, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import * as fs from 'fs-extra';
import * as path from 'path';
import sharp = require('sharp');

const dir = path.join(process.cwd(), '/upload/file');

@ApiTags('资源访问')
@Controller('assets')
export class AssetsController {
  @Get('img/:fileName')
  getImg(@Param() params, @Query() query, @Res() res: Response) {
    if (!params.fileName) {
      res.send('file not found');
      return;
    }
    const url = path.join(dir, params.fileName);
    if (!fs.existsSync(url)) {
      res.send('file not found');
      return;
    }
    const info = fs.createReadStream(url);
    const width = parseInt(query.width);
    const height = parseInt(query.height);
    if (typeof width === 'number' && typeof height === 'number' && width > 0 && height > 0) {
      const roundedCornerResizer = sharp().resize(width, height).png();
      info.pipe(roundedCornerResizer).pipe(res);
    } else {
      info.pipe(res);
    }
  }

  @Get('video/:fileName')
  getVideo(@Param() params, @Headers() headers, @Res() res: Response) {
    if (!params.fileName) {
      res.send('file not found');
      return;
    }
    const url = path.join(dir, params.fileName);
    if (!fs.existsSync(url)) {
      res.send('file not found');
      return;
    }
    const stat = fs.statSync(url);
    const fileSize = stat.size;
    const range = headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const file = fs.createReadStream(url, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(url).pipe(res);
    }
  }
}
