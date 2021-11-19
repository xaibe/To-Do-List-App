/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Timestamp } from 'typeorm';

enum Status {
  Completed = 'completed',
  InProgress = 'inProgress',
  Pending = 'pending',
  Missed = 'missed',
}

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

  @IsEnum(Status)
  @ApiProperty({
    description: 'we can add event status by using enum',
    enum: Status,
  })
  status: Status;

  @ApiProperty()
  eventDateTime: Date;
}
