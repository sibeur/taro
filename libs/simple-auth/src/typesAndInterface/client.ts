import { Client } from '../entities/client';

export interface ClientRepository {
  findClientById(clientId: string): Promise<Client | null>;
  isSecretKeyValid(client: Client, secretKey: string): boolean;
}
