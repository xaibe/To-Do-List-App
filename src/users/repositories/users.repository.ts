/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async validateUser(email: string, pass: string) {
    try {
      const userr = await this.createQueryBuilder('user')
        .where('user.email = :email', { email: email })
        .addSelect('user.password')
        .getOne();
      if (userr) {
        const isMatch = await this.comparePassword(pass, userr.password);
        if (!isMatch) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          throw new UnauthorizedException('Email/password incorrect');
        }
        const { password, ...user } = userr;
        console.log('user in auth.service', user);
        return user;
      }
    } catch (ex) {
      throw ex;
    }
  }

  private async comparePassword(
    password: string,
    userPassword: string,
  ): Promise<any> {
    try {
      return bcrypt.compare(password, userPassword);
    } catch (ex) {
      throw ex;
    }
  }
}
