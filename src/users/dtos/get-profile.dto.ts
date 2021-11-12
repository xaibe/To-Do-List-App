/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class GetProfileDto {
  @ApiProperty()
  access_token: string;
}
