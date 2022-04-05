import { Injectable } from '@nestjs/common';
import { Client } from '../entities/client';
import { ClientRepository } from '../repositories/client.repository';

@Injectable()
export class AuthService {
  constructor(private clientRepo: ClientRepository) {}
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
