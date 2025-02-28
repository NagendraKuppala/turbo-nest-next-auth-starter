import {
  IsEmail,
  IsString,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 20)
  firstName: string;

  @IsString()
  @Length(1, 20)
  @IsOptional()
  lastName: string;

  @IsString()
  @Length(1, 20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  @IsOptional()
  username: string;

  @IsOptional()
  @IsString()
  avatarUrl: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 100)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character',
  })
  password: string;
}
