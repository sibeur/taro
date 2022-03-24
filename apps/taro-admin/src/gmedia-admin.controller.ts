import { Controller, Get } from '@nestjs/common';
import { TaroAdminService } from './taro-admin.service';

@Controller()
export class TaroAdminController {
  constructor(private readonly taroAdminService: TaroAdminService) {}

  @Get()
  getHello(): string {
    return this.taroAdminService.getHello();
  }
}
