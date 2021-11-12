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
} from '@nestjs/swagger';
import { LoginUserDto } from 'src/users/dtos/Login-user.dto';
import { Public } from './constants';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthsService } from './auths.service';
@ApiTags('Auths')
@Controller('auth')
export class AuthsController {
  constructor(private authsService: AuthsService) {}

  @ApiCreatedResponse({ type: LoginUserDto })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @ApiCreatedResponse({ type: LoginUserDto })
  @ApiBadRequestResponse()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() body: LoginUserDto) {
    return this.authsService.login(req.user);
  }
}
