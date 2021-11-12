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
    private readonly todoRepository: Repository<ToDo>,
    private authService: AuthService,
  ) {}

  async findAll(): Promise<ToDo[]> {
    // const task = this.todolistRepository.findOne(id, { relations: ['user'] });
    const userId = this.getuserid();
    if (userId) {
      const user = this.todoRepository.find({
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
      const task = this.todoRepository.findOne({
        where: { id: id, userId: userid },
      });

      console.log('task', await task);
      //const task = this.todolistRepository.findOne(id);
      if (await task) {
        const matchresult = this.matchuserid((await task).userId, userid);
        if (matchresult) {
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

  createtodotask(
    createToDoListDto: CreateToDoDto,
    userid: number,
  ): Promise<ToDo> {
    if (userid) {
      createToDoListDto.userId = userid;
      return this.todoRepository.save(createToDoListDto);
    } else {
      throw new ForbiddenException();
    }
  }

  async deletetodotask(id: number): Promise<DeleteResult> {
    const userId = this.getuserid();
    if (userId) {
      const task = this.todoRepository.findOne({
        where: { id: id },
      });
      if (await task) {
        const verifyuser = this.matchuserid(userId, (await task).userId);
        if (verifyuser) {
          return this.todoRepository.delete(id);
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

  getuserid() {
    const userid = this.authService.getuserid();
    console.log('got userid in todolist ', userid);
    return userid;
  }

  matchuserid(exist_userid: any, new_userid: any) {
    if (exist_userid === new_userid) {
      return true;
    } else {
      return false;
    }
  }

  async updatetodotask(
    id: number,
    updateToDoListDto: UpdateToDoDto,
  ): Promise<UpdateResult> {
    const userId = this.getuserid();
    if (userId) {
      const task = this.todoRepository.findOne({
        where: { id: id },
      });
      if (await task) {
        const verifyuser = this.matchuserid(userId, (await task).userId);
        if (verifyuser) {
          return this.todoRepository.update(id, updateToDoListDto);
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
