import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class PatchEmailDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class PatchPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}

export class PatchNameDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
