import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  FortyTwoAuthGuard,
  SessionUser,
  Public,
  OTP,
  TwoFactorAuthentication,
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
  async login() {
    return;
  }

  @Public()
  @UseGuards(FortyTwoAuthGuard)
  @Get('42/redirect')
  @HttpCode(HttpStatus.OK)
  async redirect() {
    return { message: 'OK' };
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() { user }: { user: SessionUser },
    @Session() session: any,
  ) {
    await this.authService.logoutUser(user, session);
    return { message: 'Logout successful' };
  }

  @Get('2fa/register')
  @HttpCode(HttpStatus.OK)
  async register2FA(
    @Req() { user }: { user: SessionUser },
    @Res({ passthrough: true }) res: Response,
  ) {
    const otpAuthUrl: string = await this.authService.generate2FASecret(
      user.id,
      user.email,
    );
    return this.authService.pipeQrCodeStream(res, otpAuthUrl);
  }

  @Post('2fa/turn-on')
  @HttpCode(HttpStatus.CREATED)
  async turnOn2FA(@Req() { user }: { user: SessionUser }, @Body() otp: OTP) {
    await this.authService.enable2FA(user, otp);
    return { msg: 'Two-factor authentication enabled' };
  }

  @Post('2fa/turn-off')
  @HttpCode(HttpStatus.CREATED)
  async turnOff2FA(@Req() { user }: { user: SessionUser }) {
    await this.authService.disable2FA(user);
    return { msg: 'Two-factor authentication disabled' };
  }

  @TwoFactorAuthentication()
  @Post('2fa/validate')
  async validate2FA(
    @Req() req: Request,
    @Res() res: Response,
    @Body() otp: OTP,
  ) {
    await this.authService.validateOTP(req.user as SessionUser, otp);
    await this.authService.login2FAUser(req, res);
    //return { msg: 'Two-factor authentication validated' };
  }

  // Debug route to check if user is authenticated
  @Get('status')
  @HttpCode(HttpStatus.OK)
  async status() {
    return { msg: 'Authenticated' };
  }

  // Debug route to check if it's public
  @Public()
  @Get('public')
  @HttpCode(HttpStatus.OK)
  async public() {
    return { msg: '@Public route' };
  }
}
