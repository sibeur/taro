import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { join } from 'path';
import { TaroAdminModule } from './taro-admin.module';
import secureSession from 'fastify-secure-session';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    TaroAdminModule,
    new FastifyAdapter(),
  );
  app.useStaticAssets({
    root: join(__dirname, '..', 'taro-admin/public'),
    prefix: '/public/',
  });
  app.setViewEngine({
    engine: {
      ejs: require('ejs'),
    },
    templates: join(__dirname, '..', 'taro-admin/views'),
  });
  app.register(secureSession, {
    secret: 'JAAzr&gMfq&9q&HPgx?Y5dXagYEA!cJycJ8bt!3e',
    salt: '!$x6cSFG4h7YgsBh',
  });
  const port = process.env.ADMIN_APP_PORT || 3001;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
