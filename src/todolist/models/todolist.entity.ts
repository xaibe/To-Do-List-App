import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('todolist')
export class ToDoList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ApiProperty()
  @Column()
  Title: string;

  @ApiProperty()
  @Column()
  Description: string;

  @ApiProperty()
  @Column()
  EventType: string;

  @ApiProperty()
  @Column()
  EventDateTime: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
