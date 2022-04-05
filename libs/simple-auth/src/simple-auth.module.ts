import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { ClientRepository } from './repositories/client.repository';
import { Client } from './entities/client';
import { readFileSync } from 'fs';
import { AuthDriver } from './typesAndInterface/auth';
import auth_config from './configs/auth_config';
import { ClientModel, ClientSchema } from './schemas/client.schema';
import { MongooseModule } from '@nestjs/mongoose';

const clientJsonFactory = {
  provide: 'clientJson',
  useFactory: () => {
    if (auth_config().driver !== AuthDriver.JSON_FILE) return [];
    const json = JSON.parse(readFileSync(auth_config().json_file, 'utf8'));
    if (!Array.isArray(json)) throw new Error('client json invalid');

    const clients = json.map(
      (c) => new Client(c.clientId, c.secretKey, c.role),
    );
    return clients;
  },
};

const conditionalImport = () => {
  let modules = [];
  if (auth_config().driver === AuthDriver.DB) {
    modules = [
      ...modules,
      MongooseModule.forFeature([
        { name: ClientModel.collName, schema: ClientSchema },
      ]),
    ];
  }
  return modules;
};
@Module({
  imports: [],
  providers: [AuthService, ClientRepository, clientJsonFactory],
  exports: [AuthService],
})
export class SimpleAuthModule {
  static forFeature(): DynamicModule {
    return {
      module: SimpleAuthModule,
      imports: [...conditionalImport()],
    };
  }
}
