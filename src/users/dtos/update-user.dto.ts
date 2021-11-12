/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, MaxLength } from 'class-validator';
export class UpdateUserDto {
  @ApiProperty()
  @IsAlphanumeric()
  @MaxLength(10)
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
