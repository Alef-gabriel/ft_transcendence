import { FortyTwoUser } from '../interfaces/fortytwo-user.interface';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FortyTwoUserDto implements FortyTwoUser {
  @IsNumber()
  id: number;
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  displayName: string;
  @IsString()
  @IsNotEmpty()
  profileUrl: string;
  @IsEmail()
  email: string;
  @IsBoolean()
  @IsOptional()
  otpEnabled?: boolean;
  @IsBoolean()
  @IsOptional()
  otpValidated?: boolean;
  @IsBoolean()
  @IsOptional()
  otpSecret?: string;
}
