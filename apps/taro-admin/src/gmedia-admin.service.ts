import { Injectable } from '@nestjs/common';

@Injectable()
export class TaroAdminService {
  getHello(): string {
    return 'Hello World!';
  }
}
