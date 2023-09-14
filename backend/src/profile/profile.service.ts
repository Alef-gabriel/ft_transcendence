import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ProfileEntity, UserEntity } from '../db/entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  QueryFailedError,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Profile } from './interfaces/profile.interface';
import { ProfileDeletedResponseDto } from './models/profile-delete-response.dto';
import { ProfileUpdatedResponseDto } from './models/profile-updated-response.dto';
import { AvatarService } from '../avatar/avatar.service';
import { plainToClass } from 'class-transformer';
import { ProfileDTO } from './models/profile.dto';
import { AvatarDTO } from '../avatar/models/avatar.dto';

@Injectable()
export class ProfileService {
  private readonly logger: Logger = new Logger(ProfileService.name);

  constructor(
    private readonly userService: UserService,
    private readonly avatarService: AvatarService,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
  ) {}

  async findByUserId(id: number): Promise<ProfileDTO> {
    const profileEntity: ProfileEntity | null =
      await this.profileRepository.findOneBy({
        userEntity: { id },
      });

    if (!profileEntity) {
      throw new NotFoundException(`User [${id}] not found`);
    }

    this.logger.log(`Profile found for user [${id}]`);
    return plainToClass(ProfileDTO, profileEntity);
  }

  async create(id: number, nickname: string): Promise<ProfileDTO> {
    const userEntity: UserEntity | null = await this.userService.findById(id);

    if (!userEntity) {
      throw new NotFoundException(`User [${id}] not found`);
    }

    const profileEntity: ProfileEntity = new ProfileEntity();
    profileEntity.nickname = nickname;
    profileEntity.userEntity = userEntity;

    let savedEntity: ProfileEntity;
    try {
      savedEntity = await this.profileRepository.save(profileEntity);
    } catch (Exception) {
      if (Exception instanceof QueryFailedError) {
        this.logger.error(`Profile already exists for user [${id}]`);
        throw new BadRequestException(`user [${id}] already has a profile`);
      }
      throw Exception;
    }

    this.logger.log(`Profile created for user [${id}]`);
    return plainToClass(ProfileDTO, savedEntity);
  }

  async update(
    id: number,
    profile: Partial<Profile>,
  ): Promise<ProfileUpdatedResponseDto> {
    const updateResult: UpdateResult = await this.profileRepository.update(
      { userEntity: { id } },
      profile,
    );

    if (!updateResult.affected) {
      this.logger.error(
        `Profile not found for user [${id}], nothing to update`,
      );
      throw new NotFoundException(`User [${id}] not found`);
    }

    this.logger.log(`Profile updated for user [${id}]`);
    return {
      updated: updateResult.affected > 0,
      affected: updateResult.affected,
    };
  }

  async delete(id: number): Promise<ProfileDeletedResponseDto> {
    const userDeleteResult: DeleteResult = await this.userService.delete(id);

    if (!userDeleteResult.affected) {
      this.logger.error(`### User [${id}] not found, nothing to delete`);
      throw new NotFoundException(`User [${id}] not found`);
    }

    this.logger.log(`### User [${id}] and profile deleted`);
    return {
      deleted: userDeleteResult.affected > 0,
      affected: userDeleteResult.affected,
    };
  }

  async addAvatar(
    userId: number,
    imageBuffer: Buffer,
    filename: string,
  ): Promise<AvatarDTO> {
    this.logger.verbose(`Adding avatar for user [${userId}]`);

    const avatar: AvatarDTO = await this.avatarService.upload(
      imageBuffer,
      filename,
    );

    this.logger.verbose(`Adding avatarId for user profile [${userId}]`);
    await this.profileRepository.update(
      { userEntity: { id: userId } },
      { avatarId: avatar.id },
    );

    this.logger.log(`Avatar added for user [${userId}]`);
    return avatar;
  }
}
