import { Inject, Injectable, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import auth_config from '../configs/auth_config';
import { Client } from '../entities/client';
import { ClientModel } from '../schemas/client.schema';
import { AuthDriver } from '../typesAndInterface/auth';
import { Model } from 'mongoose';
import { fromJSON } from '@core/common/helpers/entity.helper';

@Injectable()
export class ClientRepository {
  constructor(
    @Optional() @Inject('clientJson') private clientJson: Client[],
    @Optional()
    @InjectModel(ClientModel.collName)
    private clientModel: Model<ClientModel>,
  ) {}

  async findClientById(clientId: string): Promise<Client | null> {
    let client: Client | null = null;
    if (auth_config().driver === AuthDriver.JSON_FILE)
      client = this.findClientByIdFromJSON(clientId);
    else if (auth_config().driver === AuthDriver.DB)
      client = await this.findClientByIdFromDB(clientId);
    return client;
  }

  isSecretKeyValid(client: Client, secretKey: string) {
    return client.secretKey === secretKey;
  }

  private findClientByIdFromJSON(clientId: string): Client {
    const [client] = this.clientJson.filter(
      (client) => client.clientId === clientId,
    );
    return client;
  }

  private async findClientByIdFromDB(clientId: string): Promise<Client> {
    const client = await this.clientModel.findOne({ clientId });
    if (!client) return null;
    return fromJSON<Client>(client.toJSON());
  }
}
