/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class CreateToDoListDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  Title: string;

  @ApiProperty()
  Description: string;

  @ApiProperty()
  EventType: string;

  @ApiProperty()
  EventDateTime: string;
}
