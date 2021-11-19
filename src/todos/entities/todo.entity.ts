import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

enum EventType {
  Birthday = 'birthday',
  Meeting = 'meeting',
  Office_Task = 'office_Task',
  Anniversity = 'anniversity',
}

enum Status {
  Completed = 'completed',
  InProgress = 'inProgress',
  Pending = 'pending',
  Missed = 'missed',
}

@Entity('todos')
export class toDo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.todo, { onDelete: 'CASCADE' })
  user: User;

  @RelationId((todo: toDo) => todo.user) // you need to specify target relation
  userId: number;

  @ApiProperty()
  @Column({ length: 100 })
  title: string;

  @ApiProperty()
  @Column({ length: 250 })
  description: string;

  @Column({
    type: 'enum',
    enum: ['meeting', 'anniversity', 'birthday', 'office_Task'],
    default: 'office_Task',
  })
  @ApiProperty({
    description: 'description of the eventType property',
    enum: EventType,
  })
  eventType: EventType;

  @Column({
    type: 'enum',
    enum: ['completed', 'inProgress', 'pending', 'missed'],
    default: 'pending',
  })
  @ApiProperty({
    description: 'we can add event status by using enum',
    enum: Status,
  })
  status: Status;

  @ApiProperty()
  @Column()
  eventDateTime: Date;

  @CreateDateColumn()
  createdAt: Date;
}
