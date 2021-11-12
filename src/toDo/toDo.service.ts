import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateToDoDto } from './dto/create-toDo.dto';
import { UpdateToDoDto } from './dto/update-toDo.dto';
import { ToDo } from './Entities/toDo.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ToDoService {
  constructor(
    @InjectRepository(ToDo)
    private readonly toDoRepository: Repository<ToDo>,
    private authService: AuthService,
  ) {}

  async findAll(userId: number): Promise<ToDo[]> {
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

  async findById(id: number, userid: number): Promise<ToDo> {
    if (userid) {
      const task = this.toDoRepository.findOne({
        where: { id: id, userId: userid },
      });

      console.log('task', await task);
      //const task = this.todolistRepository.findOne(id);
      if (await task) {
        const matchResult = this.matchUserId((await task).userId, userid);
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

  createToDo(createToDoDto: CreateToDoDto, userid: number): Promise<ToDo> {
    if (userid) {
      createToDoDto.userId = userid;
      return this.toDoRepository.save(createToDoDto);
    } else {
      throw new ForbiddenException();
    }
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

  private matchUserId(exist_userid: any, new_userid: any) {
    if (exist_userid === new_userid) {
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
