import { Injectable, Logger } from '@nestjs/common';
import { Client } from '../entities/client';
import { AuthDriver, ClientRepository } from '../typesAndInterface';

@Injectable()
export class ImplClientFileRepository implements ClientRepository {
  private readonly logger = new Logger('ClientRepository');
  constructor(private clientJson: Client[]) {
    this.logger.log(`Simple Auth Driver: ${AuthDriver.JSON_FILE}`);
  }

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
