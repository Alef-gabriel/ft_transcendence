import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FortyTwoUser, Public } from '../auth';
import { ProfileEntity } from '../db/entities';
import { Profile } from './interfaces/profile.interface';
import { ProfileUpdatedResponse } from './interfaces/profile-updated-respose.interface';
import { ProfileDeletedResponse } from './interfaces/profile-deleted-response.interface';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() { user }: { user: FortyTwoUser }): Promise<Profile> {
    return await this.profileService.findById(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async saveProfile(
    @Req() { user }: { user: FortyTwoUser },
    @Body() profile: Profile,
  ): Promise<Profile> {
    return await this.profileService.save(user.id, profile);
  }

  @Put()
  @HttpCode(HttpStatus.CREATED)
  async updateProfile(
    @Req() { user }: { user: FortyTwoUser },
    @Body() profile: Partial<Profile>,
  ): Promise<ProfileUpdatedResponse> {
    return await this.profileService.update(user.id, profile);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteProfile(
    @Req() { user }: { user: FortyTwoUser },
  ): Promise<ProfileDeletedResponse> {
    return await this.profileService.delete(user.id);
  }
}
