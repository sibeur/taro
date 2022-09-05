import auth_config, { AuthConfig } from '../configs/auth_config';
import { Client } from '../entities/client';
import { ClientModel } from '../schemas/client.schema';
import { Model } from 'mongoose';
import { AuthDriver } from '../typesAndInterface/auth';
import { readFileSync } from 'fs';
import { ImplClientDBRepository } from '../repositories/client-db.repository';
import { ImplClientFileRepository } from '../repositories/client-file.repository';
import { getModelToken } from '@nestjs/mongoose';

export const clientModelFactory = {
  provide: 'CLIENT_MODEL',
  useValue: getModelToken(ClientModel.collName),
};

export const clientAuthConfigFactory = {
  provide: 'AUTH_CONFIG',
  useValue: auth_config(),
};

export const clientJsonFactory = {
  provide: 'CLIENT_JSON',
  useFactory: (authConfig: AuthConfig) => {
    if (authConfig.driver !== AuthDriver.JSON_FILE) return [];
    const json = JSON.parse(readFileSync(authConfig.json_file, 'utf8'));
    if (!Array.isArray(json)) throw new Error('client json invalid');

    const clients = json.map(
      (c) => new Client(c.clientId, c.secretKey, c.role),
    );
    return clients;
  },
  inject: [{ token: 'AUTH_CONFIG', optional: false }],
};

export const clientRepositoryFactory = {
  provide: 'ClientRepository',
  useFactory: (
    authConfig?: AuthConfig,
    clientJson?: Client[],
    clientModel?: Model<ClientModel>,
  ) => {
    if (authConfig.driver === AuthDriver.DB)
      return new ImplClientDBRepository(clientModel);
    return new ImplClientFileRepository(clientJson);
  },
  inject: [
    { token: 'AUTH_CONFIG', optional: false },
    { token: 'CLIENT_JSON', optional: true },
    { token: 'CLIENT_MODEL', optional: true },
  ],
};
