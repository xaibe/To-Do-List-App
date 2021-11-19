/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthsService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.validateUser(email, pass);
    const newUser = this.login(user);
    return newUser;
  }

  async authenticateUser(email: string, password: string) {
    return this.usersService.validateUser(email, password);
  }
  async login(user: any) {
    const payload = { username: user.firstName + user.lastName, sub: user.id };
    //saving user id    this.userid = user.id;
    //  console.log({ user, payload });
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
