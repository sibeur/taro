import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import CONF from '../configs/admin_config';

@Injectable()
export class UIReqInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const token = request.session.get('taro_sess') || null;
    return next.handle().pipe(
      map((resp) => {
        return {
          pageTitle: 'Taro Admin',
          error: null,
          mimes: null,
          rules: null,
          media_api_url: CONF().MEDIA_API_URL,
          token,
          env: CONF().ADMIN_ENV,
          ...resp,
        };
      }),
    );
  }
}
