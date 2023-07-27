// @ts-ignore
import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { SessionUser } from '../index';

//This class is used to do 42 OAuth2 authentication
@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(FortyTwoStrategy.name);

  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('APP_OAUTH2_CLIENT_ID'),
      clientSecret: configService.get<string>('APP_OAUTH2_CLIENT_SECRET'),
      callbackURL: configService.get<string>('APP_OAUTH2_CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<SessionUser> {
    this.logger.verbose(`### Validating user ${profile.id} with 42 strategy`);
    const {
      id,
      username,
      displayName,
      emails,
      profileUrl,
      otpEnabled,
      otpSecret,
    } = profile;
    const user: SessionUser = await this.authService.validateUser({
      id,
      username,
      displayName,
      profileUrl,
      email: emails[0].value,
      otpEnabled,
      otpSecret,
      otpValidated: false,
    });
    return user || null;
  }
}
