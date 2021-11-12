import { ApiProperty } from '@nestjs/swagger';
import { ToDo } from 'src/toDo/Entities/toDo.entity';
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

  @OneToMany(() => ToDo, (toDo) => toDo.user)
  todo: ToDo[];

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
