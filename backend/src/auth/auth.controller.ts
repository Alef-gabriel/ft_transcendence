import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import {
  FortyTwoAuthGuard,
  FortyTwoUser,
  Public,
  OTP,
  TwoFactorAuthentication,
  ResponseMessage,
} from './index';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(FortyTwoAuthGuard)
  @Get('42/login')
  @HttpCode(HttpStatus.NO_CONTENT)
  async login(): Promise<void> {
    return;
  }

  @Public()
  @UseGuards(FortyTwoAuthGuard)
  @Get('42/redirect')
  @HttpCode(HttpStatus.OK)
  async redirect(): Promise<ResponseMessage> {
    return { message: 'OK' };
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() { user }: { user: FortyTwoUser },
    @Session() session: Record<string, any>,
  ): Promise<ResponseMessage> {
    await this.authService.logoutUser(user, session);
    return { message: 'Logout successful' };
  }

  @Get('2fa/register')
  async register2FA(
    @Req() { user }: { user: FortyTwoUser },
    @Res() res: Response,
  ): Promise<any> {
    const otpAuthUrl: string = await this.authService.generate2FASecret(
      user.id,
      user.email,
    );
    return this.authService.pipeQrCodeStream(res, otpAuthUrl);
  }

  @Post('2fa/turn-on')
  async turnOn2FA(
    @Req() req: Request,
    @Res() res: Response,
    @Body() otp: OTP,
  ): Promise<any> {
    await this.authService.enable2FA(req.user as FortyTwoUser, otp);
    await this.authService.login2FAUser(req, res);
  }

  @TwoFactorAuthentication()
  @Post('2fa/validate')
  async validate2FA(
    @Req() req: Request,
    @Res() res: Response,
    @Body() otp: OTP,
  ): Promise<any> {
    await this.authService.validateOTP(req.user as FortyTwoUser, otp);
    await this.authService.login2FAUser(req, res);
  }

  @Post('2fa/turn-off')
  @HttpCode(HttpStatus.CREATED)
  async turnOff2FA(
    @Req() { user }: { user: FortyTwoUser },
  ): Promise<ResponseMessage> {
    await this.authService.disable2FA(user);
    return { message: 'Two-factor authentication disabled' };
  }

  // Debug route to check if user is authenticated
  @Get('status')
  @HttpCode(HttpStatus.OK)
  async status(): Promise<ResponseMessage> {
    return { message: 'Authenticated' };
  }

  // Debug route to check if it's public
  @Public()
  @Get('public')
  @HttpCode(HttpStatus.OK)
  async public(): Promise<ResponseMessage> {
    return { message: '@Public route' };
  }
}
