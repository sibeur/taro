import { MediaModule } from '@core/media';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import DB_CONF from './configs/db_config';
import { TaroAdminController } from './taro-admin.controller';
import { TaroAdminService } from './taro-admin.service';

@Module({
  imports: [MongooseModule.forRoot(DB_CONF.MONGO_URL), MediaModule],
  controllers: [TaroAdminController],
  providers: [TaroAdminService],
})
export class TaroAdminModule {}
