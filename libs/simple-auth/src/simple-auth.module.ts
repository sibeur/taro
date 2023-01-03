import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthDriver } from './typesAndInterface/auth';
import { ClientModel, ClientSchema } from './schemas/client.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  clientJsonFactory,
  clientRepositoryFactory,
} from './providers/client.provider';
import auth_config from './configs/auth_config';
import { ConfigModule } from '@nestjs/config';

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
  imports: [ConfigModule.forFeature(auth_config)],
  providers: [
    AuthService,
    clientRepositoryFactory,
    clientJsonFactory,
  ],
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
