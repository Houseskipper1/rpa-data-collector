import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateParameterTimeDto {
  @IsInt()
  @Min(60000)
  @IsNotEmpty()
  refreshFrequency: number;
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
