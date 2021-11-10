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
    private readonly todolistRepository: Repository<ToDoList>,
  ) {}

  findAll(): Observable<ToDoList[]> {
    return from(this.todolistRepository.find());
  }

  findById(id: number): Observable<ToDoList> {
    return from(this.todolistRepository.findOne(id));
  }

  createtodotask(createToDoListDto: CreateToDoListDto): Observable<ToDoList> {
    return from(this.todolistRepository.save(createToDoListDto));
  }

  deletetodotask(id: number): Observable<DeleteResult> {
    return from(this.todolistRepository.delete(id));
  }

  updatetodotask(
    id: number,
    updateToDoListDto: UpdateToDoListDto,
  ): Observable<UpdateResult> {
    return from(this.todolistRepository.update(id, updateToDoListDto));
  }
}
