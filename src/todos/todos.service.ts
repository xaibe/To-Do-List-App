import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateToDoDto } from './dtos/create-toDo.dto';
import { UpdateToDoDto } from './dtos/update-toDo.dto';
import { toDo } from './Entities/todo.entity';
import { AuthsService } from 'src/auth/auths.service';
import { User } from 'src/users/entities/user.entity';
import * as moment from 'moment';
import { PatchToDoDto } from './dtos/patch-toDo.dto';

@Injectable()
export class ToDosService {
  constructor(
    @InjectRepository(toDo)
    private readonly toDoRepository: Repository<toDo>,
    private authsService: AuthsService,
  ) {}

  async findAll(userId: number): Promise<toDo[]> {
    // const task = this.todolistRepository.findOne(id, { relations: ['user'] });
    if (userId) {
      const user = this.toDoRepository.find({
        where: { user: userId },
      });

      if (user === null || (await user).length === 0) {
        const message = 'You dont have any todo task';
        throw new NotFoundException(message);
      } else {
        return user;
      }
    } else {
      const message = 'please login first';
      throw new UnauthorizedException(message);
    }
  }

  async findById(id: number, userId: number): Promise<toDo> {
    console.log('entered find by ID and user id is', userId);
    if (userId) {
      const task = await this.toDoRepository.findOne({
        where: { id: id, user: userId },
      });

      console.log('task', task);
      //const task = this.todolistRepository.findOne(id);
      if (task) {
        const matchResult = this.matchUserId(task.userId, userId);
        if (matchResult) {
          return task;
        } else {
          const message = 'you can not find todo task of others';
          throw new UnauthorizedException(message);
        }
      } else {
        const message = 'todo task doesnot exist';
        throw new NotFoundException(message);
      }
    } else {
      const message = 'please login first';
      throw new UnauthorizedException(message);
    }
  }

  async createToDo(createToDoDto: CreateToDoDto, userId: number) {
    // createToDoDto.userId = userid;
    // console.log('createdto after edit', createToDoDto);
    const { title, description, eventType, eventDateTime } = createToDoDto;
    const user = new User();
    user.id = userId;
    const todo = new toDo();
    todo.title = title;
    todo.description = description;
    todo.eventType = eventType;
    todo.eventDateTime = eventDateTime;
    todo.user = user;

    const endTime = moment(todo.eventDateTime).add(5, 'minutes').toDate();

    const startTime = moment(todo.eventDateTime)
      .subtract(5, 'minutes')
      .toDate();

    const task = await this.toDoRepository.findOne({
      where: {
        eventDateTime: Between(startTime, endTime),
      },
    });

    // todo.eventDateTime=
    //   const task = await this.toDoRepository.findOne({
    //    where: {
    //     eventDateTime BETWEEN '2014-02-01' AND '2014-03-01' },
    //  });

    console.log('fetched task', task);
    if (task) {
      const message =
        ' You already have todo for the same date & time! please change the task time';
      throw new UnauthorizedException(message);
    } else {
      const result = await this.toDoRepository.save(todo);
      console.log('result after add', result);
      return result;
    }
  }

  async deleteToDo(id: number, userId: number): Promise<DeleteResult> {
    if (userId) {
      const task = await this.toDoRepository.findOne({
        where: { id: id },
      });
      if (task) {
        const verifyUser = this.matchUserId(userId, task.userId);
        if (verifyUser) {
          return this.toDoRepository.delete(id);
        } else {
          const message = 'you can not delete todo task of others';
          throw new UnauthorizedException(message);
        }
      } else {
        const message = 'this todo task doesnot exist';
        throw new NotFoundException(message);
      }
    } else {
      const message = 'please login first';
      throw new UnauthorizedException(message);
    }
  }

  private matchUserId(existUserId: any, newUserId: any) {
    if (existUserId === newUserId) {
      return true;
    } else {
      return false;
    }
  }

  async updateToDo(
    id: number,
    userId: number,
    updateToDoDto: UpdateToDoDto,
  ): Promise<UpdateResult> {
    if (userId) {
      const task = this.toDoRepository.findOne({
        where: { id: id },
      });
      if (await task) {
        const verifyUser = this.matchUserId(userId, (await task).userId);
        if (verifyUser) {
          return this.toDoRepository.update(id, updateToDoDto);
        } else {
          const message = 'you can not update todo task of others';
          throw new UnauthorizedException(message);
        }
      } else {
        const message = 'this todo task doesnot exist';
        throw new NotFoundException(message);
      }
    } else {
      const message = 'please login first';
      throw new UnauthorizedException(message);
    }
  }

  async patchToDo(
    id: number,
    userId: number,
    patchToDoDto: PatchToDoDto,
  ): Promise<UpdateResult> {
    if (userId) {
      const task = this.toDoRepository.findOne({
        where: { id: id },
      });
      if (await task) {
        const verifyUser = this.matchUserId(userId, (await task).userId);
        if (verifyUser) {
          return this.toDoRepository.update(id, patchToDoDto);
        } else {
          const message = 'you can not update todo task of others';
          throw new UnauthorizedException(message);
        }
      } else {
        const message = 'this todo task doesnot exist';
        throw new NotFoundException(message);
      }
    } else {
      const message = 'please login first';
      throw new UnauthorizedException(message);
    }
  }
}
