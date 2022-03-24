import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { TaroAdminModule } from './taro-admin.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    TaroAdminModule,
    new FastifyAdapter(),
  );
  const port = process.env.ADMIN_APP_PORT || 3001;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
