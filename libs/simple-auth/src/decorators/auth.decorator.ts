import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthSessionGuard } from '../guards/auth-session.guard';
import { AuthGuard } from '../guards/auth.guard';
import { Role, ROLES_KEY } from '../typesAndInterface/role';

export function Auth(...roles: Role[]) {
  return applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(AuthGuard));
}

export function AuthSession(roles: Role[], redirectTo: string) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    SetMetadata('redirectTo', redirectTo),
    UseGuards(AuthSessionGuard),
  );
}
