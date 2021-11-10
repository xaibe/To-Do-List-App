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

  findAll(): Observable<ToDoList[]> {
    const userId = this.getuserid();
    if (userId) {
      return from(this.todolistRepository.find({ where: { userId: userId } }));
    } else {
      throw new UnauthorizedException();
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

  deletetodotask(id: number): Observable<DeleteResult> {
    return from(this.todolistRepository.delete(id));
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

  updatetodotask(
    id: number,
    updateToDoListDto: UpdateToDoListDto,
  ): Observable<UpdateResult> {
    return from(this.todolistRepository.update(id, updateToDoListDto));
  }
}
