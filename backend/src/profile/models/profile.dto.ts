import { Profile } from '../interfaces/profile.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileDto implements Profile {
  @IsString()
  @IsNotEmpty()
  avatar: string;
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
