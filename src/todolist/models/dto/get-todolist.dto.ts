/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class GetToDoListDto {
  @ApiProperty()
  access_token: string;
}
