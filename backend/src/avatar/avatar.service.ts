import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvatarEntity } from '../db/entities';
import { AvatarDTO } from './models/avatar.dto';
import { instanceToPlain, plainToClass } from 'class-transformer';

@Injectable()
export class AvatarService {
  private readonly logger: Logger = new Logger(AvatarService.name);

  constructor(
    @InjectRepository(AvatarEntity)
    private readonly avatarRepository: Repository<AvatarEntity>,
  ) {}

  async upload(dataBuffer: Buffer, filename: string): Promise<AvatarDTO> {
    const newAvatar: AvatarEntity = this.avatarRepository.create({
      filename,
      data: dataBuffer,
    });

    await this.avatarRepository.save(newAvatar);

    this.logger.verbose(`Avatar [${newAvatar.id}] uploaded`);
    return plainToClass(AvatarDTO, newAvatar);
  }

  async getById(id: number): Promise<AvatarEntity> {
    const avatar: AvatarEntity | null = await this.avatarRepository.findOneBy({
      id,
    });
    if (!avatar) {
      throw new NotFoundException();
    }
    return avatar;
  }
}
