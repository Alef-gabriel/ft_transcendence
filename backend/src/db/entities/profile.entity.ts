import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { Profile } from '../../profile/interfaces/profile.interface';
import { AvatarEntity } from './avatar.entity';

@Entity({ name: 'profiles' })
export class ProfileEntity implements Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  avatar: string;

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => AvatarEntity, {
    nullable: true,
  })
  public avatar?: AvatarEntity;

  @Column({ nullable: true })
  public avatarId?: number;

  @OneToOne(() => UserEntity, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  userEntity: UserEntity;
}
