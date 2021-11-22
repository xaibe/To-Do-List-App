/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { toDo } from '../Entities/todo.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
@EntityRepository(toDo)
export class TodosRepository extends Repository<toDo> {}
