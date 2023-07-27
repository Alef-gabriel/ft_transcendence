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

    //Check if the route is public
    if (isPublic) {
      return true;
    }

    //Check if user not is authenticated.
    //Under the covers, this method checks if user property exists on request object
    if (!request.isAuthenticated()) {
      return false;
    }

    //User is authenticated, but 2FA is not enabled
    if (!request.user.otpEnabled) {
      return true;
    }

    //User has 2FA enabled, check if the route is for 2FA validation and if the user is not validated yet
    if (
      isTwoFactorAuth &&
      request.user.otpEnabled &&
      !request.user.otpValidated
    ) {
      return true;
    }

    //Check if user is not 2FA validated for non-2FA routes
    if (!request.user.otpValidated) {
      this.logger.debug('### User has 2FA enabled, but is not validated yet');
      return false;
    }

    //User is authenticated and 2FA validated
    return true;
  }
}
