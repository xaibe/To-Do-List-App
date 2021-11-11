import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateToDoListDto } from '../models/dto/create-todolist.dto';
import { UpdateToDoListDto } from '../models/dto/update-todolist.dto';
import { ToDoList } from '../models/todolist.entity';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class ToDoListService {
  constructor(
    @InjectRepository(ToDoList)
    private readonly todolistRepository: Repository<ToDoList>,
    private authService: AuthService,
  ) {}

  async findAll(): Promise<ToDoList[]> {
    // const task = this.todolistRepository.findOne(id, { relations: ['user'] });
    const userId = this.getuserid();
    if (userId) {
      const user = this.todolistRepository.find({
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

  async findById(id: number, userid: number): Promise<ToDoList> {
    if (userid) {
      const task = this.todolistRepository.findOne({
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
    createToDoListDto: CreateToDoListDto,
    userid: number,
  ): Promise<ToDoList> {
    if (userid) {
      createToDoListDto.userId = userid;
      return this.todolistRepository.save(createToDoListDto);
    } else {
      throw new ForbiddenException();
    }
  }

  async deletetodotask(id: number): Promise<DeleteResult> {
    const userId = this.getuserid();
    if (userId) {
      const task = this.todolistRepository.findOne({
        where: { id: id },
      });
      if (await task) {
        const verifyuser = this.matchuserid(userId, (await task).userId);
        if (verifyuser) {
          return this.todolistRepository.delete(id);
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
    updateToDoListDto: UpdateToDoListDto,
  ): Promise<UpdateResult> {
    const userId = this.getuserid();
    if (userId) {
      const task = this.todolistRepository.findOne({
        where: { id: id },
      });
      if (await task) {
        const verifyuser = this.matchuserid(userId, (await task).userId);
        if (verifyuser) {
          return this.todolistRepository.update(id, updateToDoListDto);
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
