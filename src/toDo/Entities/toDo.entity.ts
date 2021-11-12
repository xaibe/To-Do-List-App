import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
enum EventType {
  Birthday = 'birthday',
  Meeting = 'meeting',
  Office_Task = 'office_Task',
  Anniversity = 'anniversity',
}
@Entity('todos')
export class ToDo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.todo, { onDelete: 'CASCADE' })
  user: User;

  @Column()
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

  //@IsEnum(EventType)
  // @Column({ type: 'enum', length: 100 })
  // @ApiProperty({
  //   description: 'description of the eventType property',
  //   enum: EventType,
  // })
  // eventType: EventType;

  // @ApiProperty()
  // @Column('int')
  // eventType: EventType;

  @ApiProperty()
  @Column()
  eventDateTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // createdAt: Date;
}
