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
  Public,
  ResponseMessage,
  TwoFactorAuthentication,
} from './index';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { FortyTwoUserDto } from './models/forty-two-user.dto';
import { OneTimePasswordDto } from './models/one-time-password.dto';
import { ResponseMessageDto } from './models/response-message.dto';

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
  async redirect(@Res() res: Response): Promise<void> {
    res.redirect('http://localhost:5173');
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() { user }: { user: FortyTwoUserDto },
    @Session() session: Record<string, any>,
  ): Promise<ResponseMessageDto> {
    await this.authService.logoutUser(user, session);
    return { message: 'Logout successful' };
  }

  @Get('2fa/register')
  async register2FA(
    @Req() { user }: { user: FortyTwoUserDto },
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
    @Body() otp: OneTimePasswordDto,
  ): Promise<any> {
    await this.authService.enable2FA(req.user as FortyTwoUserDto, otp);
    await this.authService.login2FAUser(req, res);
  }

  @TwoFactorAuthentication()
  @Post('2fa/validate')
  async validate2FA(
    @Req() req: Request,
    @Res() res: Response,
    @Body() otp: OneTimePasswordDto,
  ): Promise<any> {
    await this.authService.validateOTP(req.user as FortyTwoUserDto, otp);
    await this.authService.login2FAUser(req, res);
  }

  @Post('2fa/turn-off')
  @HttpCode(HttpStatus.CREATED)
  async turnOff2FA(
    @Req() { user }: { user: FortyTwoUserDto },
  ): Promise<ResponseMessage> {
    await this.authService.disable2FA(user);
    return { message: 'Two-factor authentication disabled' };
  }

  // Debug route to check if user is authenticated
  @Get('status')
  @HttpCode(HttpStatus.OK)
  async status(): Promise<ResponseMessageDto> {
    return { message: 'Authenticated' };
  }

  // Debug route to check if it's public
  @Public()
  @Get('public')
  @HttpCode(HttpStatus.OK)
  async public(): Promise<ResponseMessageDto> {
    return { message: '@Public route' };
  }
}
