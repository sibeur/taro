import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UIReqInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((resp) => {
        return {
          pageTitle: 'Taro Admin',
          error: null,
          mimes: null,
          rules: null,
          ...resp,
        };
      }),
    );
  }
}
