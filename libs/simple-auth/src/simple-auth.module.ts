import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { ClientRepository } from './repositories/client.repository';

@Module({
  providers: [AuthService, ClientRepository],
  exports: [AuthService],
})
export class SimpleAuthModule {}
