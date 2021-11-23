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
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/users/role.enum';
import { Roles } from 'src/users/roles.decorator';
@ApiTags('Auths')
@Controller('auth')
export class AuthsController {
  constructor(
    private authsService: AuthsService,
    private usersService: UsersService,
  ) {}

  @Public()
  @Post('login-user')
  async loginUser(@Body() body: LoginUserDto): Promise<any> {
    return this.authsService.validateUser(body.email, body.password);
  }

  @Public()
  @Post('login-admin')
  async loginAdmin(@Body() body: LoginUserDto): Promise<any> {
    return this.authsService.validateAdmin(body.email, body.password);
  }

  @Public()
  @ApiCreatedResponse({ type: User })
  @ApiBadRequestResponse()
  @Post('user')
  async createUser(@Body() body: CreateUserDto): Promise<any> {
    const user = await this.usersService.createUser(body);
    const loginUser = await this.authsService.loginUser(user);
    return loginUser;
  }

  @Public()
  @ApiCreatedResponse({ type: User })
  @ApiBadRequestResponse()
  @Post('admin')
  async createAdmin(@Body() body: CreateUserDto): Promise<any> {
    const user = await this.usersService.createAdminUser(body);
    const loginUser = await this.authsService.loginAdmin(user);
    return loginUser;
  }
}
