import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { UpdateUserDto } from '../models/dto/update-user.dto';
import { User } from '../models/user.entity';

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
}
