import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import config from 'src/config/config';
import jwt = require('jsonwebtoken');
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization = request.header("authorization");
    let decode = {};
    if (authorization) {
      const token = authorization;
      try {
        decode = jwt.verify(token, config.keys);
        request.user = decode;
      } catch (error) {
        throw new HttpException('token not found', HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException('token not found', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
