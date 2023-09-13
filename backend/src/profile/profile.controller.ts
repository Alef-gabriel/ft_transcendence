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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FortyTwoUser } from '../auth';
import { FortyTwoUserDto } from '../user/models/forty-two-user.dto';
import { ProfileDTO } from './models/profile.dto';
import { ProfileUpdatedResponseDto } from './models/profile-updated-response.dto';
import { ProfileDeletedResponseDto } from './models/profile-delete-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarEntity } from '../db/entities';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProfile(
    @Req() { user }: { user: FortyTwoUserDto },
  ): Promise<ProfileDTO> {
    return await this.profileService.findById(user.id);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async saveProfile(
    @Req() { user }: { user: FortyTwoUserDto },
    @Body() body: { nickname: string },
  ): Promise<ProfileDTO> {
    return await this.profileService.create(user.id, body.nickname);
  }

  @Post('avatar')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Req() @Req() { user }: { user: FortyTwoUserDto },
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AvatarEntity> {
    return this.profileService.addAvatar(
      user.id,
      file.buffer,
      file.originalname,
    );
  }

  @Put()
  @HttpCode(HttpStatus.CREATED)
  async updateProfile(
    @Req() { user }: { user: FortyTwoUserDto },
    @Body() profile: Partial<ProfileDTO>,
  ): Promise<ProfileUpdatedResponseDto> {
    return await this.profileService.update(user.id, profile);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteProfile(
    @Req() { user }: { user: FortyTwoUser },
  ): Promise<ProfileDeletedResponseDto> {
    return await this.profileService.delete(user.id);
  }
}
