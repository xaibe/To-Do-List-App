import { ApiProperty } from '@nestjs/swagger';
import { ToDoList } from 'src/todolist/models/todolist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ToDoList, (toDoList) => toDoList.user)
  todolist: ToDoList;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
