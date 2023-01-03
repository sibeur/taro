import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from '../entities/client';
import { SimpleAuthModule } from '../simple-auth.module';
import { ClientRepository } from '../typesAndInterface/client';

@Injectable()
export class AuthService {
  constructor(
    @Inject('ClientRepository') private clientRepo: ClientRepository,
  ) {}
  async validateCredential(
    clientId: string,
    secretKey: string,
  ): Promise<Client> {
    const client = await this.clientRepo.findClientById(clientId);
    if (!client) return null;
    if (!this.clientRepo.isSecretKeyValid(client, secretKey)) return null;
    return client;
  }
}
