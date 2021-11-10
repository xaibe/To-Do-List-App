/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  userid = null;
  loggedin = false;

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        this.loggedin = true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }
    this.loggedin = false;
    return null;
  }

  async login(user: any) {
    const payload = { username: user.name, sub: user.id };
    //saving user id
    this.userid = user.id;
    console.log({ user, payload });
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  getuserid() {
    if (this.loggedin === true) {
      console.log('getuseridcalled', this.userid);
      return this.userid;
    } else {
      console.log('user is not logged in');
    }
  }

  async getProfile(user: any) {
    console.log('user', user);

    // async validate(payload: any)
    //   return { userId: payload.sub, username: payload.username };

    // const payload = { username: user.username, sub: user.userId };
    // return {
    //   access_token: this.jwtService.sign(payload),
    // };
  }
}
