import { ApiProperty } from '@nestjs/swagger';
import { toDo } from 'src/todos/Entities/todo.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => toDo, (toDo) => toDo.user)
  todo: toDo[];

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
