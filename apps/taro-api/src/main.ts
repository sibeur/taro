import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { TaroAPIModule } from './app.module';
import fmp from 'fastify-multipart';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    TaroAPIModule,
    new FastifyAdapter(),
  );
  app.enableCors();
  app.register(fmp);
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'version',
  });
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
