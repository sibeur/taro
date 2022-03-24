import { AuthDriver } from '../typesAndInterface/auth';

export default {
  driver: process.env.SA_DRIVER || AuthDriver.JSON_FILE,
  json_file: process.env.SA_JSON_FILE || 'clients.json',
};
