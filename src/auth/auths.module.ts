/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LocalStrategy } from './Strategies/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthsService } from './auths.service';
import { JwtStrategy } from './Strategies/jwt.strategy';
import { AuthsController } from './auths.controller';
import { APP_GUARD } from '@nestjs/core/constants';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],

  controllers: [AuthsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AuthsService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthsService],
})
export class AuthModule {}
