import { MediaModule } from '@core/media';
import { SimpleAuthModule } from '@core/simple-auth';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import CONF from './configs/admin_config';
import { TaroAdminController } from './taro-admin.controller';
import { TaroAdminService } from './taro-admin.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(CONF().MONGO_URL),
    MediaModule,
    SimpleAuthModule.forFeature(),
  ],
  controllers: [TaroAdminController],
  providers: [TaroAdminService],
})
export class TaroAdminModule {}
