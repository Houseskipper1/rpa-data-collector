import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateParameterTimeDto {
  @IsInt()
  @Min(60000)
  @IsNotEmpty()
  @ApiProperty()
  refreshFrequency: number;
}

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  @MinLength(8)
  password: string;
}
