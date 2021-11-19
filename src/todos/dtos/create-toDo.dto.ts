/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Timestamp } from 'typeorm';
enum EventType {
  Birthday = 'birthday',
  Meeting = 'meeting',
  Office_Task = 'office_Task',
  Anniversity = 'anniversity',
}
export class CreateToDoDto {
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
