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
    const userId = this.getuserid();
    if (userId) {
      const user = this.todolistRepository.find({
        where: { userId: userId },
      });

      if (user) {
        return user;
      } else {
        const message = 'You dont have any todo task';
        throw new NotFoundException(message);
      }
    } else {
      const message = 'please login first';
      throw new UnauthorizedException(message);
    }
  }

  async findById(id: number): Promise<ToDoList> {
    const userId = this.getuserid();
    if (userId) {
      const user = this.todolistRepository.findOne({
        where: { id: id },
      });
      if (await user) {
        const verifyuser = this.matchuserid(userId, (await user).userId);
        if (verifyuser) {
          return user;
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

  createtodotask(createToDoListDto: CreateToDoListDto): Observable<ToDoList> {
    const userid = this.getuserid();
    if (userid) {
      createToDoListDto.userId = userid;
      return from(this.todolistRepository.save(createToDoListDto));
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
