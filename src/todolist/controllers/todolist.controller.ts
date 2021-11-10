import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Request,
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
import { AuthService } from 'src/auth/services/auth.service';

@ApiTags('todolist')
@Controller('todolist')
export class ToDoListController {
  constructor(
    private authservice: AuthService,
    private toDoListService: ToDoListService,
  ) {}

  @Public()
  @ApiBearerAuth()
  @ApiOkResponse({ type: ToDoList, isArray: true })
  @Get('all')
  getusers(@Request() req): Observable<CreateToDoListDto[]> {
    const userid = this.authservice.getuserid();
    console.log('got userid in todolist ', userid);
    return this.toDoListService.findAll();
  }

  @ApiOkResponse({ type: ToDoList })
  @ApiNotFoundResponse()
  @Get(':id')
  getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<CreateToDoListDto> {
    const todolist = this.toDoListService.findById(id);
    if (!todolist) {
      throw new NotFoundException();
    }
    return todolist;
  }

  @ApiBearerAuth()
  @ApiBadRequestResponse()
  @Put('update/:id')
  updatefeed(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateToDoListDto,
  ): Observable<UpdateResult> {
    return this.toDoListService.updatetodotask(id, updateUserDto);
  }

  @ApiBadRequestResponse()
  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.toDoListService.deletetodotask(id);
  }

  @Public()
  @ApiCreatedResponse({ type: ToDoList })
  @ApiBadRequestResponse()
  @Post('create')
  create(@Body() body: CreateToDoListDto): Observable<CreateToDoListDto> {
    return this.toDoListService.createtodotask(body);
  }
}
