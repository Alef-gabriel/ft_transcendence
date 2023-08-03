import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'profiles' })
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  avatar: string;

  @OneToOne(() => UserEntity, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  userEntity: UserEntity;
}
