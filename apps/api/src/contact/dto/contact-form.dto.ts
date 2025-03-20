import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ContactFormDto {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  subject: string;

  @IsString()
  @MinLength(10)
  @IsNotEmpty()
  message: string;

  @IsString()
  recaptchaToken: string;
}
