/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class LoginUserDto {
  name: string;
  firstName: string;

  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
