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
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @ApiBearerAuth()
  @ApiOkResponse({ type: User, isArray: true })
  @Get('FindAllUsers')
  getusers(): Observable<CreateUserDto[]> {
    return this.usersService.findAll();
  }

  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse()
  @Get('FindUserByid/:id')
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
  @Put('UpdateUserProfile/:id')
  updatefeed(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Observable<UpdateResult> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @ApiBadRequestResponse()
  @Delete('DelteUserProfile/:id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.usersService.deleteUser(id);
  }

  @Public()
  @ApiCreatedResponse({ type: User })
  @ApiBadRequestResponse()
  @Post('RegisterUser')
  async create(
    @Body() body: CreateUserDto,
  ): Promise<Observable<CreateUserDto>> {
    const user = this.usersService.hashpassword(body);
    return this.usersService.createUser(await user);
  }
}
