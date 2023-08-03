import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ProfileEntity, UserEntity } from '../db/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './interfaces/profile.interface';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    private readonly userService: UserService,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
  ) {}

  async findById(id: number): Promise<ProfileEntity> {
    const profileEntity: ProfileEntity | null =
      await this.profileRepository.findOneBy({
        userEntity: { id },
      });

    if (!profileEntity) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return profileEntity;
  }

  async save(id: number, profile: Profile): Promise<ProfileEntity> {
    const userEntity: UserEntity | null = await this.userService.findById(id);

    if (!userEntity) {
      throw new NotFoundException(`User ${id} not found`);
    }

    const profileEntity: ProfileEntity = new ProfileEntity();
    profileEntity.nickname = profile.nickname;
    profileEntity.avatar = profile.avatar;
    profileEntity.userEntity = userEntity;

    return await this.profileRepository.save(profileEntity);
  }
}
