import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core';
import { IS_TWO_FACTOR_AUTH } from '../decorators/two-factor-auth.decorator';

// This class is used to check if user is authenticated, all non-public routes should use this guard
@Injectable()
export class UserAuthenticatedGuard implements CanActivate {
  private readonly logger = new Logger(UserAuthenticatedGuard.name);
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    //Get Custom Decorators Metadata
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isTwoFactorAuth = this.reflector.getAllAndOverride<boolean>(
      IS_TWO_FACTOR_AUTH,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    this.logger.verbose(`### Checking if user is authenticated`);

    //Allow if the route is public
    if (isPublic) {
      return true;
    }

    //Block if user not is authenticated.
    if (!request.isAuthenticated()) {
      return false;
    }

    //Allow if user is authenticated and 2FA is not enabled
    if (!request.user.otpEnabled) {
      return true;
    }

    //Allow if user is authenticated and 2FA is validated
    if (request.user.otpValidated) {
      return true;
    }

    //Grant access only to 2FA authentication routes, if user enabled 2FA but is not validated yet
    return isTwoFactorAuth;
  }
}
