/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
} from 'class-validator';
import { Role } from '../role.enum';
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

  roles: Role;

  @IsString()
  @ApiProperty()
  password: string;
}
