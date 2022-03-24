import { Injectable } from '@nestjs/common';
import auth_config from '../configs/auth_config';
import { Client } from '../entities/client';
import { ClientRepository } from '../repositories/client.repository';
import { AuthDriver } from '../typesAndInterface/auth';

@Injectable()
export class AuthService {
  constructor(private clientRepo: ClientRepository) {}
  async validateCredential(
    clientId: string,
    secretKey: string,
  ): Promise<Client> {
    const client = await this.clientRepo.findClientById(clientId);
    if (!client) return null;
    if (!this.isSecretKeyValid(client, secretKey)) return null;
    return client;
  }

  private isSecretKeyValid(client: Client, secretKey: string) {
    if (auth_config.driver === AuthDriver.JSON_FILE) {
      return client.secretKey === secretKey;
    }
    return false;
  }
}
