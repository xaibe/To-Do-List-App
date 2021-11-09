/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class LoginUserDto {
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
