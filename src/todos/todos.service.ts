import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateToDoDto } from './dtos/create-toDo.dto';
import { UpdateToDoDto } from './dtos/update-toDo.dto';
import { toDo } from './Entities/todo.entity';
import { AuthsService } from 'src/auth/auths.service';
import { User } from 'src/users/entities/user.entity';

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
        where: { userId: userId },
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
    if (userId) {
      const task = this.toDoRepository.findOne({
        where: { id: id, userId: userId },
      });

      console.log('task', await task);
      //const task = this.todolistRepository.findOne(id);
      if (await task) {
        const matchResult = this.matchUserId((await task).userId, userId);
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
    console.log('userid', userId);

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
    const result = await this.toDoRepository.save(todo);
    console.log('result after add', result);
    return result;
  }

  async deleteToDo(id: number, userId: number): Promise<DeleteResult> {
    if (userId) {
      const task = this.toDoRepository.findOne({
        where: { id: id },
      });
      if (await task) {
        const verifyUser = this.matchUserId(userId, (await task).userId);
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
}