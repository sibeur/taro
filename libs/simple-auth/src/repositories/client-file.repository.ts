import { Injectable } from '@nestjs/common';
import { Client } from '../entities/client';
import { ClientRepository } from '../typesAndInterface/client';

@Injectable()
export class ImplClientFileRepository implements ClientRepository {
  constructor(private clientJson: Client[]) {}

  async findClientById(clientId: string): Promise<Client | null> {
    const [client] = this.clientJson.filter(
      (client) => client.clientId === clientId,
    );
    return client;
  }

  isSecretKeyValid(client: Client, secretKey: string): boolean {
    return client.secretKey === secretKey;
  }
}
