import { HttpStatus } from '@nestjs/common';

export interface HttpResponse<T> {
  statusCode?: HttpStatus;
  message?: string;
  data: T;
}
