import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { instanceToPlain } from 'class-transformer';
import ResponseUtil from 'src/utils/response';

@Injectable()
export class ResultInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if(typeof data === "object"){
          return ResponseUtil(instanceToPlain(data));
        }else{
          return data;
        }
      }),
    );
  }
}

