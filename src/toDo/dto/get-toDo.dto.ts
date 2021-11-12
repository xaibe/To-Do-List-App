/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class GetToDoDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  userId: string;
}
