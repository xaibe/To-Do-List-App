/* eslint-disable prettier/prettier */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { AuthsService } from '../auths.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authsService: AuthsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }
  // async validate(payload: any): Promise<CreateUserDto> {
  //   const user = await this.authService.validateUser(payload);
  //   if (!user) {
  //     throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
  //   }
  //   return user;
  // }

  async validate(payload: any) {
    console.log('entered validate in jwwt strategy', 'payload', payload);
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
