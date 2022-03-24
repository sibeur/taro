import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Client } from '../entities/client';
import { AuthService } from '../services/auth.service';
import { Role, ROLES_KEY } from '../typesAndInterface/role';

enum AuthGuardErrorMessage {
  AUTH_INVALID = 'Auth invalid',
}

function isAuthValid(authMode, authToken: string): boolean {
  if (authMode != 'Basic') return false;
  if (!authToken || authToken == '') return false;
  return true;
}

function decodeBasicAuthToken(token): { clientId: string; secretKey: string } {
  const decodedToken = Buffer.from(token, 'base64').toString('binary');
  const [clientId, secretKey] = decodedToken.split(':');
  return { clientId, secretKey };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader)
      throw new BadRequestException(AuthGuardErrorMessage.AUTH_INVALID);
    const [authMode, authToken] = authHeader.split(' ');
    if (!isAuthValid(authMode, authToken))
      throw new BadRequestException(AuthGuardErrorMessage.AUTH_INVALID);
    const { clientId, secretKey } = decodeBasicAuthToken(authToken);
    const client: Client = await this.authService.validateCredential(
      clientId,
      secretKey,
    );
    if (!client) return false;

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return requiredRoles.some((role) => client.role == role);
  }
}
