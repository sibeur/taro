export class Client {
  clientId: string;
  secretKey: string;
  role: string;

  constructor(clientId?: string, secretKey?: string, role?: string) {
    this.clientId = clientId;
    this.secretKey = secretKey;
    this.role = role;
  }
}
