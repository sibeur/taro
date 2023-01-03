import { AuthConfig } from '../configs/auth_config';
import { Client } from '../entities/client';
import { ClientModel } from '../schemas/client.schema';
import { Model } from 'mongoose';
import { AuthDriver } from '../typesAndInterface/auth';
import { readFileSync } from 'fs';
import { ImplClientDBRepository, ImplClientFileRepository } from '../repositories';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

const modelToken = getModelToken(ClientModel.collName)

export const clientJsonFactory = {
  provide: 'CLIENT_JSON',
  useFactory: (configService: ConfigService<AuthConfig>) => {
    try {
      const driver = configService.get('driver');
      const json_file = configService.get('json_file');
      if (driver !== AuthDriver.JSON_FILE) return [];
      const json = JSON.parse(readFileSync(json_file, 'utf8'));
      if (!Array.isArray(json)) throw new Error('client json invalid');
  
      const clients = json.map(
        (c) => new Client(c.clientId, c.secretKey, c.role),
      );
      return clients;
    } catch (error) {
      return []
    }
  },
  inject: [ConfigService],
};

export const clientRepositoryFactory = {
  provide: 'ClientRepository',
  useFactory: (
    configService: ConfigService<AuthConfig>,
    clientJson?: Client[],
    clientModel?: Model<ClientModel>,
  ) => {
    const driver = configService.get<string>('driver')
    if (driver === AuthDriver.DB)
      return new ImplClientDBRepository(clientModel);
    return new ImplClientFileRepository(clientJson);
  },
  inject: [
    ConfigService,
    { token: 'CLIENT_JSON', optional: true },
    { token: modelToken, optional: true },
  ],
};
