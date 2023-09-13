import Avatar from '../interfaces/avatar.interface';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
} from 'class-validator';

export class AvatarDTO implements Avatar {
  @IsNotEmpty()
  @IsNumber()
  id: number;
  @IsNotEmpty()
  @IsString()
  filename: string;
  @IsNotEmptyObject()
  data: Uint8Array;
}
