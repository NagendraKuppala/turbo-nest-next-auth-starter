import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsOptional,
  IsString,
  IsBoolean,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class UpdateProfileDto extends PartialType(
  OmitType(CreateUserDto, [
    'email',
    'password',
    'emailVerified',
    'avatarUrl',
  ] as const),
) {
  @IsString()
  @MinLength(2, { message: 'First Name must be at least 2 characters' })
  @MaxLength(20, { message: 'First Name must be less than 20 characters' })
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Last Name must be less than 20 characters' })
  lastName?: string;

  @IsString()
  @MinLength(2, { message: 'Username must be at least 2 characters' })
  @MaxLength(20, { message: 'Username must be less than 20 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;

  @IsBoolean()
  @IsOptional()
  newsletterOptIn?: boolean;
}
