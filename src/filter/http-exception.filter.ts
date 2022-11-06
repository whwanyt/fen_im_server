import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import ResponseUtil, { ResponseParams } from 'src/utils/response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse();
    if (typeof err === 'string') {
      response.status(200).json(ResponseUtil({ code: status, error: err }));
    } else {
      response
        .status(200)
        .json(ResponseUtil({ code: status, error: (err as ResponseParams).message }));
    }
  }
}
