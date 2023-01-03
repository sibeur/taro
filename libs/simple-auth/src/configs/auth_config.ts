import { AuthDriver } from '../typesAndInterface/auth';

export class AuthConfig {
  driver: string;
  json_file?: string;
}
export default (): AuthConfig => ({
  driver: process.env.SA_DRIVER || AuthDriver.JSON_FILE,
  json_file: process.env.SA_JSON_FILE || 'clients.json',
});
