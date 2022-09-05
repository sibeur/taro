import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthDriver } from './typesAndInterface/auth';
import { ClientModel, ClientSchema } from './schemas/client.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  clientAuthConfigFactory,
  clientJsonFactory,
  clientModelFactory,
  clientRepositoryFactory,
} from './providers/client.provider';
import auth_config from './configs/auth_config';

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
  providers: [
    AuthService,
    clientRepositoryFactory,
    clientJsonFactory,
    clientModelFactory,
    clientAuthConfigFactory,
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
