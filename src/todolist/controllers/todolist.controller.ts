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
import { CreateToDoListDto } from '../models/dto/create-todolist.dto';
import { UpdateToDoListDto } from '../models/dto/update-todolist.dto';
import { ToDoList } from '../models/todolist.entity';
import { ToDoListService } from '../services/todolist.service';

@ApiTags('todolist')
@Controller('todolist')
export class ToDoListController {
  constructor(private toDoListService: ToDoListService) {}

  @Public()
  @ApiBearerAuth()
  @ApiOkResponse({ type: ToDoList, isArray: true })
  @Get('all')
  getusers(): Observable<CreateToDoListDto[]> {
    return this.toDoListService.findAll();
  }

  @ApiOkResponse({ type: ToDoList })
  @ApiNotFoundResponse()
  @Get(':id')
  getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<CreateToDoListDto> {
    const user = this.toDoListService.findById(id);
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
    @Body() updateUserDto: UpdateToDoListDto,
  ): Observable<UpdateResult> {
    return this.toDoListService.updateUser(id, updateUserDto);
  }

  @ApiBadRequestResponse()
  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.toDoListService.deleteUser(id);
  }

  @Public()
  @ApiCreatedResponse({ type: ToDoList })
  @ApiBadRequestResponse()
  @Post('create')
  create(@Body() body: CreateToDoListDto): Observable<CreateToDoListDto> {
    return this.toDoListService.createUser(body);
  }
}
