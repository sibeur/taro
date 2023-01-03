import { Injectable, Logger } from '@nestjs/common';
import { Client } from '../entities/client';
import { ClientModel } from '../schemas/client.schema';
import { Model } from 'mongoose';
import { fromJSON } from '@core/common/helpers/entity.helper';
import { ClientRepository } from '../typesAndInterface/client';
import { InjectModel } from '@nestjs/mongoose';
import { AuthDriver } from '../typesAndInterface/auth';

@Injectable()
export class ImplClientDBRepository implements ClientRepository {
  private readonly logger = new Logger('ClientRepository');
  constructor(private clientModel: Model<ClientModel>) {
    this.logger.log(`Simple Auth Driver: ${AuthDriver.DB}`);
  }

  async findClientById(clientId: string): Promise<Client | null> {
    const client = await this.clientModel.findOne({ clientId });
    if (!client) return null;
    return fromJSON<Client>(client.toJSON());
  }

  isSecretKeyValid(client: Client, secretKey: string): boolean {
    return client.secretKey === secretKey;
  }
}
