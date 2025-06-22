import { IsEmail, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  shopLink?: string;

  @IsString()
  provider: string;

  @IsString()
  language?: string;
}
