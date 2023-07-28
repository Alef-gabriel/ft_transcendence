import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(FortyTwoAuthGuard)
  @Get('42/login')
  async login(@Res() res: any): Promise<void> {
    return res.status(200);
  }

  @Public()
  @UseGuards(FortyTwoAuthGuard)
  @Get('42/redirect')
  async redirect(@Res() res: any): Promise<void> {
    return res.status(200).json({
      message: 'OK',
    });
  }

  @Get('logout')
  async logout(
    @Req() { user }: { user: SessionUser },
    @Res() res: any,
    @Session() session: any,
  ): Promise<void> {
    if (session) {
      session.destroy();
    }
    if (user.otpValidated) {
      await this.authService.invalidateOTP(user.id);
    }
    return res.status(200).json({ message: 'Logout successful' });
  }

  // Debug route to check if user is authenticated
  @Get('status')
  async status(@Res() res: any) {
    return res.status(200).json({ msg: 'Authenticated' });
  }

  // Debug route to check if it's public
  @Public()
  @Get('public')
  async public(@Res() res: any) {
    return res.status(200).json({ msg: '@Public route' });
  }

  @Post('2fa/register')
  async register2FA(@Req() { user }: { user: SessionUser }, @Res() res: any) {
    const otpAuthUrl: string = await this.authService.generate2FASecret(
      user.id,
      user.email,
    );
    return this.authService.pipeQrCodeStream(res, otpAuthUrl);
  }

  @Post('2fa/turn-on')
  async turnOn2FA(
    @Req() { user }: { user: SessionUser },
    @Res() res: any,
    @Body() otp: OTP,
  ) {
    if (user.otpEnabled) {
      throw new BadRequestException('OTP already enabled');
    }

    if (!this.authService.is2FACodeValid(otp.code, user.otpSecret!)) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.authService.enable2FA(user.id);
    return res.status(201).json({ msg: 'Two-factor authentication enabled' });
  }

  @Post('2fa/turn-off')
  async turnOff2FA(@Req() { user }: { user: SessionUser }, @Res() res: any) {
    if (!user.otpEnabled) {
      throw new BadRequestException('OTP already disabled');
    }

    await this.authService.disable2FA(user.id);
    return res.status(201).json({ msg: 'Two-factor authentication disabled' });
  }

  @TwoFactorAuthentication()
  @Post('2fa/validate')
  async validate2FA(@Req() req: Request, @Res() res: any, @Body() otp: OTP) {
    const user: SessionUser = req.user as SessionUser;

    if (user.otpValidated) {
      throw new BadRequestException('OTP already validated');
    }

    if (!this.authService.is2FACodeValid(otp.code, user.otpSecret!)) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    await this.authService.validateOTP(user.id);

    req.logIn({ ...req.user, otpValidated: true }, function (err: any) {
      if (err) {
        throw new InternalServerErrorException('Error on logIn');
      }

      return res
        .status(200)
        .json({ msg: 'Two-factor authentication validated' });
    });
  }
}
