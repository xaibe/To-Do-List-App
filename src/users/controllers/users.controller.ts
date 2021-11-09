import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { Public } from 'src/auth/constants';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { UpdateUserDto } from '../models/dto/update-user.dto';
import { User } from '../models/user.entity';
import { UsersService } from '../services/users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @ApiBearerAuth()
  @ApiOkResponse({ type: User, isArray: true })
  @Get('all')
  getusers(): Observable<CreateUserDto[]> {
    return this.usersService.findAll();
  }

  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse()
  @Get(':id')
  getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<CreateUserDto> {
    const user = this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @ApiBearerAuth()
  @ApiBadRequestResponse()
  @Put('update/:id')
  updatefeed(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Observable<UpdateResult> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @ApiBadRequestResponse()
  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.usersService.deleteUser(id);
  }

  @Public()
  @ApiCreatedResponse({ type: User })
  @ApiBadRequestResponse()
  @Post('create')
  create(@Body() body: CreateUserDto): Observable<CreateUserDto> {
    return this.usersService.createUser(body);
  }
}
