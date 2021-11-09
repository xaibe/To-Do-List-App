import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateToDoListDto } from '../models/dto/create-todolist.dto';
import { UpdateToDoListDto } from '../models/dto/update-todolist.dto';
import { ToDoList } from '../models/todolist.entity';

@Injectable()
export class ToDoListService {
  constructor(
    @InjectRepository(ToDoList)
    private readonly userRepository: Repository<ToDoList>,
  ) {}

  findAll(): Observable<ToDoList[]> {
    return from(this.userRepository.find());
  }

  findById(userId: number): Observable<ToDoList> {
    return from(this.userRepository.findOne(userId));
  }

  async findOne(email: string): Promise<ToDoList> {
    return this.userRepository.findOne({ where: { email } });
  }

  createUser(CreateToDoListDto: CreateToDoListDto): Observable<ToDoList> {
    return from(this.userRepository.save(CreateToDoListDto));
  }

  deleteUser(id: number): Observable<DeleteResult> {
    return from(this.userRepository.delete(id));
  }

  updateUser(
    id: number,
    updateToDoListDto: UpdateToDoListDto,
  ): Observable<UpdateResult> {
    return from(this.userRepository.update(id, updateToDoListDto));
  }
}
