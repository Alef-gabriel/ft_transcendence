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
import { ProfileDto } from './models/profile.dto';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    private readonly userService: UserService,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
  ) {}

  async findById(id: number): Promise<ProfileDto> {
    const profileEntity: ProfileEntity | null =
      await this.profileRepository.findOneBy({
        userEntity: { id },
      });

    if (!profileEntity) {
      throw new NotFoundException(`User [${id}] not found`);
    }

    this.logger.log(`Profile found for user [${id}]`);
    return {
      nickname: profileEntity.nickname,
      avatar: profileEntity.avatar,
    };
  }

  async save(id: number, profile: Profile): Promise<Profile> {
    const userEntity: UserEntity | null = await this.userService.findById(id);

    if (!userEntity) {
      throw new NotFoundException(`User [${id}] not found`);
    }

    const profileEntity: ProfileEntity = new ProfileEntity();
    profileEntity.nickname = profile.nickname;
    profileEntity.avatar = profile.avatar;
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
    return {
      nickname: savedEntity.nickname,
      avatar: savedEntity.avatar,
    };
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
}
