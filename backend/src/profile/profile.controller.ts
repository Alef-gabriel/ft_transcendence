import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FortyTwoUser, Public } from '../auth';
import { ProfileEntity } from '../db/entities';
import { Profile } from './interfaces/profile.interface';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  //TODO: Create DTO for ProfileEntity with partial fields, exclude userEntity
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
