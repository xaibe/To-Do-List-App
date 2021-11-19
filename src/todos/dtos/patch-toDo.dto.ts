/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

enum Status {
  Completed = 'completed',
  InProgress = 'inProgress',
  Pending = 'pending',
  Missed = 'missed',
}

export class PatchToDoDto {
  @IsEnum(Status)
  @ApiProperty({
    description: 'we can add event status by using enum',
    enum: Status,
  })
  status: Status;
}
