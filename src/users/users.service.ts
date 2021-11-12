import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Observable<User[]> {
    return from(this.userRepository.find());
  }

  findById(userId: number): Observable<User> {
    return from(this.userRepository.findOne(userId));
  }

  async findOne(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  createUser(CreateUserDto: CreateUserDto): Observable<User> {
    return from(this.userRepository.save(CreateUserDto));
  }

  deleteUser(id: number): Observable<DeleteResult> {
    return from(this.userRepository.delete(id));
  }

  updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Observable<UpdateResult> {
    return from(this.userRepository.update(id, updateUserDto));
  }

  async hashpassword(user: any) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(user.password, saltOrRounds);
    user.password = hash;
    return user;
  }
}
