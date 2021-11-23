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
        .andWhere(`user.roles = 'user'`)
        .addSelect('user.password')
        .getOne();
      if (!userr) {
        throw new UnauthorizedException('Email/password incorrect');
      }
      const isMatch = await this.comparePassword(pass, userr.password);

      if (!isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        throw new UnauthorizedException('Email/password incorrect');
      }
      const { password, ...user } = userr;
      return user;
    } catch (ex) {
      throw ex;
    }
  }

  async validateAdmin(email: string, pass: string) {
    try {
      const admin = await this.createQueryBuilder('user')
        .where('user.email = :email', { email: email })
        .andWhere(`user.roles = 'admin'`)
        .addSelect('user.password')
        .getOne();
      if (!admin) {
        throw new UnauthorizedException('Email/password incorrect');
      }
      const isMatch = await this.comparePassword(pass, admin.password);

      if (!isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        throw new UnauthorizedException('Email/password incorrect');
      }
      const { password, ...user } = admin;
      return user;
    } catch (ex) {
      throw ex;
    }
  }

  private async comparePassword(
    password: string,
    userPassword: string,
  ): Promise<any> {
    try {
      const result = await bcrypt.compare(password, userPassword);
      return result;
    } catch (ex) {
      throw ex;
    }
  }
}
