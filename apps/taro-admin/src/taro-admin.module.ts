import { MediaModule } from '@core/media';
import { SimpleAuthModule } from '@core/simple-auth';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import DB_CONF from './configs/db_config';
import { TaroAdminController } from './taro-admin.controller';
import { TaroAdminService } from './taro-admin.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(DB_CONF().MONGO_URL),
    MediaModule,
    SimpleAuthModule.forFeature(),
  ],
  controllers: [TaroAdminController],
  providers: [TaroAdminService],
})
export class TaroAdminModule {}
