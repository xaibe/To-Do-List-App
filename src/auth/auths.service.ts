/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthsService {
  constructor(
    // @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.validateUser(email, pass);
    const newUser = this.loginUser(user);
    return newUser;
  }

  async authenticateUser(email: string, password: string) {
    return this.usersService.validateUser(email, password);
  }

  async loginUser(user: any) {
    const payload = {
      username: user.firstName + user.lastName,
      sub: user.id,
      role: user.roles,
    };
    console.log('payload', payload);
    //saving user id    this.userid = user.id;
    //  console.log({ user, payload });
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
  async validateAdmin(email: string, pass: string): Promise<any> {
    const user = await this.usersService.validateAdmin(email, pass);
    const newUser = this.loginAdmin(user);
    return newUser;
  }

  async loginAdmin(user: any) {
    console.log('user', user);

    const payload = {
      username: user.firstName + user.lastName,
      sub: user.id,
      role: user.roles,
    };
    console.log('payload', payload);
    //saving user id    this.userid = user.id;
    //  console.log({ user, payload });
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
