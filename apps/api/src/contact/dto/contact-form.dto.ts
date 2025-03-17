import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ContactFormDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the contact' })
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Question about deals',
    description: 'Subject of the message',
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    example: 'I would like to know more about...',
    description: 'Message content',
  })
  @IsString()
  @MinLength(10)
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'reCAPTCHA token for verification' })
  @IsString()
  recaptchaToken: string;
}
