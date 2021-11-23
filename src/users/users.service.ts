import {
  ConflictException,
  Delete,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { ifError } from 'assert';
import { Role } from './role.enum';
@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository, // @Inject(forwardRef(() => AuthsService)) // private authsService: AuthsService,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async findOne(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async validateUser(email: string, password: string): Promise<any> {
    return this.userRepository.validateUser(email, password);
  }

  async validateAdmin(email: string, password: string): Promise<any> {
    return this.userRepository.validateAdmin(email, password);
  }

  deleteUser(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.findOne(createUserDto.email);
    if (user) {
      const message = 'this email is already registered';
      throw new ForbiddenException(message);
    } else {
      const hashedPassword = await this.hashPassword(createUserDto.password);
      createUserDto.password = hashedPassword;

      const createdUser = await this.userRepository.save(createUserDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...usser } = createdUser;
      return usser;
    }
  }

  async createAdminUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      const hashedPassword = await this.hashPassword(createUserDto.password);
      createUserDto.password = hashedPassword;
      createUserDto.roles = Role.Admin;
      const createdUser = await this.userRepository.save(createUserDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...usser } = createdUser;
      return usser;
    } catch (err) {
      if (err.code == 23505) {
        throw new ConflictException(err.message);
      }
      throw err;
    }
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    const hashedPassword = await this.hashPassword(updateUserDto.password);
    updateUserDto.password = await hashedPassword;
    return this.userRepository.update(id, updateUserDto);
  }

  private async hashPassword(pass: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(pass, saltOrRounds);
    return hash;
  }
}
