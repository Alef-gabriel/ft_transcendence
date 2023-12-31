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
  DataSource,
  DeleteResult,
  QueryFailedError,
  QueryRunner,
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
    private dataSource: DataSource,
  ) {}

  async findByUserId(userId: number): Promise<ProfileDTO> {
    const profileEntity: ProfileEntity | null =
      await this.profileRepository.findOneBy({
        userEntity: { id: userId },
      });

    if (!profileEntity) {
      throw new NotFoundException(`User [${userId}] not found`);
    }

    this.logger.log(`Profile found for user [${userId}]`);
    return plainToClass(ProfileDTO, profileEntity);
  }

  async create(userId: number, nickname: string): Promise<ProfileDTO> {
    const userEntity: UserEntity | null = await this.userService.findById(
      userId,
    );

    if (!userEntity) {
      throw new NotFoundException(`User [${userId}] not found`);
    }

    const profileEntity: ProfileEntity = new ProfileEntity();
    profileEntity.nickname = nickname;
    profileEntity.userEntity = userEntity;

    let savedEntity: ProfileEntity;
    try {
      savedEntity = await this.profileRepository.save(profileEntity);
    } catch (Exception) {
      if (Exception instanceof QueryFailedError) {
        this.logger.error(`Profile already exists for user [${userId}]`);
        throw new BadRequestException(`user [${userId}] already has a profile`);
      }
      throw Exception;
    }

    this.logger.log(`Profile created for user [${userId}]`);
    return plainToClass(ProfileDTO, savedEntity);
  }

  async update(
    userId: number,
    profile: Partial<Profile>,
  ): Promise<ProfileUpdatedResponseDto> {
    const updateResult: UpdateResult = await this.profileRepository.update(
      { userEntity: { id: userId } },
      profile,
    );

    if (!updateResult.affected) {
      this.logger.error(
        `Profile not found for user [${userId}], nothing to update`,
      );
      throw new NotFoundException(`User [${userId}] not found`);
    }

    this.logger.log(`Profile updated for user [${userId}]`);
    return {
      updated: updateResult.affected > 0,
      affected: updateResult.affected,
    };
  }

  async delete(userId: number): Promise<ProfileDeletedResponseDto> {
    const profileDto: ProfileDTO = await this.findByUserId(userId);

    const userDeleteResult: DeleteResult = await this.userService.delete(
      userId,
    );

    if (!userDeleteResult.affected) {
      this.logger.error(`### User [${userId}] not found, nothing to delete`);
      throw new NotFoundException(`User [${userId}] not found`);
    }

    this.logger.log(`### User [${userId}] and profile deleted`);

    if (!profileDto.avatarId) {
      return {
        deleted: userDeleteResult.affected > 0,
        affected: userDeleteResult.affected,
      };
    }

    const avatarDeleteResult: DeleteResult = await this.avatarService.delete(
      profileDto.avatarId,
    );

    if (!avatarDeleteResult.affected) {
      this.logger.error(
        `### Avatar [${profileDto.avatarId}] not found, nothing to delete`,
      );
      throw new NotFoundException(`Avatar [${profileDto.avatarId}] not found`);
    }

    this.logger.log(`### User [${userId}] avatar deleted`);

    return {
      deleted: userDeleteResult.affected > 0 && avatarDeleteResult.affected > 0,
      affected: userDeleteResult.affected + avatarDeleteResult.affected,
    };
  }

  async uploadAvatar(
    userId: number,
    imageBuffer: Buffer,
    filename: string,
  ): Promise<AvatarDTO> {
    this.logger.verbose(`Updating avatar for user [${userId}]`);

    let avatarDTO: AvatarDTO | null = null;

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const profileEntity: ProfileEntity | null =
        await queryRunner.manager.findOneBy(ProfileEntity, {
          userEntity: { id: userId },
        });

      avatarDTO = await this.avatarService.uploadWithQueryRunner(
        imageBuffer,
        filename,
        queryRunner,
      );

      await queryRunner.manager.update(
        ProfileEntity,
        { userEntity: { id: userId } },
        { avatarId: avatarDTO.id },
      );

      if (profileEntity?.avatarId) {
        await this.avatarService.deleteWithQueryRunner(
          profileEntity.avatarId,
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return avatarDTO;
  }
}
