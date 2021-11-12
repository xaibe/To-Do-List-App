/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class UpdateToDoDto {
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
