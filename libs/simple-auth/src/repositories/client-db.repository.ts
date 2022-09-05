import { Injectable } from '@nestjs/common';
import { Client } from '../entities/client';
import { ClientModel } from '../schemas/client.schema';
import { Model } from 'mongoose';
import { fromJSON } from '@core/common/helpers/entity.helper';
import { ClientRepository } from '../typesAndInterface/client';

@Injectable()
export class ImplClientDBRepository implements ClientRepository {
  constructor(private clientModel: Model<ClientModel>) {}

  async findClientById(clientId: string): Promise<Client | null> {
    const client = await this.clientModel.findOne({ clientId });
    if (!client) return null;
    return fromJSON<Client>(client.toJSON());
  }

  isSecretKeyValid(client: Client, secretKey: string): boolean {
    return client.secretKey === secretKey;
  }
}
