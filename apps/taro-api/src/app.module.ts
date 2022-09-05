import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaModule } from '@core/media';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import DB_CONF from './configs/db_config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(DB_CONF().MONGO_URL),
    MediaModule.coreRestAPIApp(),
  ],
  controllers: [],
  providers: [],
})
export class TaroAPIModule {}
