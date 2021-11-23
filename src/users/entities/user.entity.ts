import { ApiProperty } from '@nestjs/swagger';
import { toDo } from 'src/todos/Entities/todo.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../role.enum';
import { Roles } from '../roles.decorator';

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
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({ select: false })
  password: string;

  @Column({ default: Role.User })
  roles: Role;

  @CreateDateColumn()
  createdAt: Date;
}
