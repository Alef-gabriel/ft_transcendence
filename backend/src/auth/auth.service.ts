import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from '../db/entities';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { toFileStream } from 'qrcode';
import { FortyTwoUser, OTP } from './index';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async loginUser(user: FortyTwoUser): Promise<FortyTwoUser> {
    this.logger.debug(`### OAuth2 user: ${JSON.stringify(user)}`);

    const userEntity: UserEntity = this.convertSessionToEntity(user);
    const databaseUser: UserEntity | null = await this.userService.findByEmail(
      user.email,
    );

    this.logger.debug(
      `### Current Database User: ${JSON.stringify(databaseUser)}`,
    );
    if (databaseUser) {
      await this.userService.update(userEntity);
      return this.convertEntityToSession(databaseUser);
    }

    this.logger.log(`### User ${user.id} not found. Creating new user`);
    const newUser: UserEntity = await this.userService.create(userEntity);
    return this.convertEntityToSession(await this.userService.save(newUser));
  }

  //Create new session for the two factor authenticated user, using express-session
  async login2FAUser(req: Request, res: Response): Promise<void> {
    const user: FortyTwoUser = req.user as FortyTwoUser;

    req.logIn({ ...user, otpValidated: true }, function (err: any) {
      if (err) {
        throw new InternalServerErrorException('Error on logIn with 2FA');
      }
      return res
        .status(201)
        .json({ message: 'Two-factor authentication validated' });
    });

    this.logger.log(`### User [${user.id}] logged in with 2FA successfully`);
  }

  async logoutUser(user: FortyTwoUser, session: any): Promise<void> {
    if (session) {
      session.destroy();
    }
    if (user.otpValidated) {
      await this.invalidateOTP(user.id);
    }

    this.logger.log(`### User [${user.id}] logged out successfully`);
  }

  async enable2FA(user: FortyTwoUser, otp: OTP): Promise<void> {
    if (user.otpEnabled) {
      throw new BadRequestException('OTP already enabled');
    }

    if (!this.is2FACodeValid(otp.code, user.otpSecret!)) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    await this.userService.enable2FA(user.id);

    this.logger.log(`### User [${user.id}] enabled 2FA successfully`);
  }

  async disable2FA(user: FortyTwoUser): Promise<void> {
    if (!user.otpEnabled) {
      throw new BadRequestException('OTP already disabled');
    }

    await this.userService.disable2FA(user.id);
    this.logger.log(`### User [${user.id}] disabled 2FA successfully`);
  }

  async validateOTP(user: FortyTwoUser, otp: OTP): Promise<void> {
    if (user.otpValidated) {
      throw new BadRequestException('OTP already validated');
    }

    if (!this.is2FACodeValid(otp.code, user.otpSecret!)) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    await this.userService.validateOTP(user.id);
    this.logger.log(`### User [${user.id}] validated OTP successfully`);
  }

  async invalidateOTP(id: number): Promise<void> {
    await this.userService.invalidateOTP(id);
    this.logger.log(`### User [${id}] invalidated OTP successfully`);
  }

  public async add2FASecret(id: number, secret: string): Promise<void> {
    await this.userService.add2FASecret(id, secret);
    this.logger.log(`### User [${id}] added 2FA secret successfully`);
  }

  public is2FACodeValid(code: string, secret: string): boolean {
    return authenticator.verify({
      token: code,
      secret: secret,
    });
  }

  public async generate2FASecret(id: number, email: string): Promise<string> {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      email,
      String(
        this.configService.get<string>('APP_TWO_FACTOR_AUTHENTICATION_NAME'),
      ),
      secret,
    );

    this.logger.log(`### User [${id}] has generated 2FA secret successfully`);

    await this.add2FASecret(id, secret);

    this.logger.log(`### User [${id}] has added 2FA secret successfully`);

    return otpAuthUrl;
  }

  public async pipeQrCodeStream(
    stream: Response,
    otpauthUrl: string,
  ): Promise<void> {
    //toDataURL()
    this.logger.verbose(`### Generating QR Code for ${otpauthUrl}`);
    return toFileStream(stream, otpauthUrl);
  }

  private convertSessionToEntity(user: FortyTwoUser): UserEntity {
    const {
      id,
      username,
      displayName,
      email,
      profileUrl,
      otpEnabled,
      otpSecret,
      otpValidated,
    } = user;
    const userEntity: UserEntity = new UserEntity();

    userEntity.id = id;
    userEntity.username = username;
    userEntity.displayName = displayName;
    userEntity.email = email;
    userEntity.profileUrl = profileUrl;
    userEntity.otpEnabled = otpEnabled;
    userEntity.otpSecret = otpSecret;
    userEntity.otpValidated = otpValidated;

    return userEntity;
  }

  private convertEntityToSession(userEntity: UserEntity): FortyTwoUser {
    const {
      id,
      username,
      displayName,
      email,
      profileUrl,
      otpEnabled,
      otpSecret,
      otpValidated,
    } = userEntity;
    return {
      id,
      username,
      displayName,
      email,
      profileUrl,
      otpEnabled,
      otpSecret,
      otpValidated,
    };
  }
}
