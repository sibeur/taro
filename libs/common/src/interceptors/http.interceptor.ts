import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '../typesAndInterface/http';

@Injectable()
export class HttpOkResponseInterceptor<T>
  implements NestInterceptor<T, HttpResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HttpResponse<T>> {
    return next.handle().pipe(
      map((resp) => {
        const data = resp.data || null;
        const msg = resp.msg || '';
        return { msg, data };
      }),
    );
  }
}
