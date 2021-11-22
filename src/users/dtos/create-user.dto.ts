/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsString, MaxLength } from 'class-validator';
export class CreateUserDto {
  @ApiProperty()
  @IsAlphanumeric()
  @MaxLength(10)
  firstName: string;

  @ApiProperty()
  lastName: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  password: string;
}
