import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Profile } from '../interfaces/profile.interface';
import { FortyTwoUserDto } from '../../user/models/forty-two-user.dto';

export class ProfileDTO implements Profile {
  @IsNotEmpty()
  @IsNumber()
  id: number;
  @IsString()
  @IsNotEmpty()
  nickname: string;
  @IsNumber()
  wins?: number;
  @IsNumber()
  losses?: number;
  @IsNumber()
  draws?: number;
  @IsNumber()
  avatarId?: number;
  @IsNotEmptyObject()
  @ValidateNested()
  userEntity: FortyTwoUserDto;
}
