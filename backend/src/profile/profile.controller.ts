import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FortyTwoAuthGuard, FortyTwoUser, Public } from '../auth';
import { ProfileEntity } from '../db/entities';
import { Request } from 'express';
import { Profile } from './interfaces/profile.interface';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProfile(
    @Req() { user }: { user: FortyTwoUser },
  ): Promise<ProfileEntity> {
    return await this.profileService.findById(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async saveProfile(
    @Req() { user }: { user: FortyTwoUser },
    @Body() profile: Profile,
  ): Promise<ProfileEntity> {
    return await this.profileService.save(user.id, profile);
  }
}
