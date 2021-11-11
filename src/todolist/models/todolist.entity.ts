import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/models/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('todolist')
export class ToDoList {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => User, (user) => user.todolist, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  eventType: string;

  @ApiProperty()
  @Column()
  eventDateTime: string;

  @CreateDateColumn()
  createdAt: Date;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // createdAt: Date;
}
