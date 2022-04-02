import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Client } from '../entities/client';
import { decodeBasicAuthToken } from '../helpers/tokenize';
import { AuthService } from '../services/auth.service';
import { Role, ROLES_KEY } from '../typesAndInterface/role';

@Injectable()
export class AuthSessionGuard implements CanActivate {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const redirectTo = this.reflector.getAllAndOverride<string>('redirectTo', [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const authToken = request.session.get('taro_sess');
    if (!authToken) return response.status(302).redirect(redirectTo);
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
