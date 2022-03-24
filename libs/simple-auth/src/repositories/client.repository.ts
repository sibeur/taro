import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import auth_config from '../configs/auth_config';
import { Client } from '../entities/client';
import { AuthDriver } from '../typesAndInterface/auth';

const { driver, json_file } = auth_config;

@Injectable()
export class ClientRepository {
  private clientJson: Client[];
  constructor() {
    if (driver === AuthDriver.JSON_FILE) {
      this.clientJson = this.parseClientJSONFromFile();
    }
  }

  async findClientById(clientId: string): Promise<Client | null> {
    let client: Client | null = null;
    if (driver === AuthDriver.JSON_FILE)
      client = this.findClientByIdFromJSON(clientId);

    return client;
  }

  private findClientByIdFromJSON(clientId: string): Client {
    const [client] = this.clientJson.filter(
      (client) => client.clientId === clientId,
    );
    return client;
  }

  private parseClientJSONFromFile(): Client[] {
    const json = JSON.parse(readFileSync(json_file, 'utf8'));
    if (!Array.isArray(json)) throw new Error('client json invalid');

    const clients = json.map(
      (c) => new Client(c.clientId, c.secretKey, c.role),
    );
    return clients;
  }
}
