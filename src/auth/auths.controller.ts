/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Request,
  Get,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiTags,
  ApiProperty,
} from '@nestjs/swagger';
import { LoginUserDto } from 'src/users/dtos/Login-user.dto';
import { Public } from './constants';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthsService } from './auths.service';
import { publicDecrypt } from 'crypto';
@ApiTags('Auths')
@Controller('auth')
export class AuthsController {
  constructor(private authsService: AuthsService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginUserDto): Promise<any> {
    return this.authsService.validateUser(body.email, body.password);
  }
}
