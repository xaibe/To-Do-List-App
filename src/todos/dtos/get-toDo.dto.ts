/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
enum EventType {
  Birthday = 'birthday',
  Meeting = 'meeting',
  Office_Task = 'office_Task',
  Anniversity = 'anniversity',
}
export class GetToDoDto {
  userId: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @IsEnum(EventType)
  @ApiProperty({
    description: 'description of the eventType property',
    enum: EventType,
  })
  eventType: EventType;

  @ApiProperty()
  eventDateTime: Date;
}
