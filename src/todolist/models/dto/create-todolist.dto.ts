/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class CreateToDoListDto {
  userId: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  eventType: string;

  @ApiProperty()
  eventDateTime: string;
}
