import { IsBoolean, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AcceptTermsDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsBoolean()
  termsAccepted: boolean;

  @IsOptional()
  @IsBoolean()
  newsletterOptIn?: boolean;
}
