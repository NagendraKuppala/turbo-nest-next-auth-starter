import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'First Name must be at least 2 characters' })
  @MaxLength(20, { message: 'First Name must be less than 20 characters' })
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Last Name must be less than 20 characters' })
  lastName: string;

  @IsString()
  @MinLength(2, { message: 'Username must be at least 2 characters' })
  @MaxLength(20, { message: 'Username must be less than 20 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;

  @IsOptional()
  @IsString()
  avatarUrl: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'Password must contain at least one special character',
  })
  password: string;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @IsNotEmpty()
  @IsBoolean()
  termsAccepted: boolean;

  @IsOptional()
  @IsBoolean()
  newsletterOptIn: boolean;

  @IsNotEmpty()
  @IsString()
  recaptchaToken?: string;
}
