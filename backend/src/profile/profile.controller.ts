import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
  StreamableFile,
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
import { AvatarDTO } from '../avatar/models/avatar.dto';
import { Readable } from 'stream';
import { AvatarService } from '../avatar/avatar.service';
import { response, Response } from 'express';
import { AvatarEntity } from '../db/entities';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly avatarService: AvatarService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getProfile(
    @Req() { user }: { user: FortyTwoUserDto },
  ): Promise<ProfileDTO> {
    return await this.profileService.findById(user.id);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  async saveProfile(
    @Req() { user }: { user: FortyTwoUserDto },
    @Body() body: { nickname: string },
  ): Promise<ProfileDTO> {
    return await this.profileService.create(user.id, body.nickname);
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

  @Post('avatar')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('avatar'))
  async uploadAvatar(
    @Req() @Req() { user }: { user: FortyTwoUserDto },
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AvatarDTO> {
    return this.profileService.addAvatar(
      user.id,
      file.buffer,
      file.originalname,
    );
  }

  @Get('avatar/:id')
  async getAvatarById(
    @Res({ passthrough: true }) response: Response,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    const avatar: AvatarEntity = await this.avatarService.getById(id);

    const stream: Readable = Readable.from(avatar.data);

    response.set({
      'Content-Disposition': `inline; filename="${avatar.filename}"`,
      'Content-Type': 'image',
    });

    return new StreamableFile(stream);
  }
}
