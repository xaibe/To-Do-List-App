import {
  Body,
  Controller,
  Delete,
  Get,
  Request,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/auth/constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetProfileDto } from './dtos/get-profile.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from './role.enum';
import { Roles } from './roles.decorator';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @ApiBearerAuth()
  @ApiOkResponse({ type: User, isArray: true })
  @Get()
  getusers(): Promise<GetProfileDto[]> {
    return this.usersService.findAll();
  }

  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Public()
  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse()
  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<GetProfileDto> {
    return this.usersService.findById(id);
  }

  @ApiBearerAuth()
  @ApiBadRequestResponse()
  @Put('/:id')
  updatefeed(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @ApiBadRequestResponse()
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Delete('/:id')
  delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.usersService.deleteUser(id);
  }
}
