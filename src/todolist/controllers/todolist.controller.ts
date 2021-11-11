import {
  Body,
  Controller,
  Delete,
  Response,
  Get,
  NotFoundException,
  Param,
  Request,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UnauthorizedException,
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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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
  getusers(): Promise<CreateToDoListDto[]> {
    return this.toDoListService.findAll();
  }

  @ApiOkResponse({ type: ToDoList })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse()
  @Get(':id')
  getUserById(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CreateToDoListDto> {
    const userid = req.user.userId;
    if (userid) {
      return this.toDoListService.findById(id, userid);
    } else {
      const message = 'please login first';
      throw new UnauthorizedException(message);
    }
  }

  @ApiBearerAuth()
  @ApiBadRequestResponse()
  @Put('update/:id')
  updatefeed(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateToDoListDto,
  ): Promise<UpdateResult> {
    return this.toDoListService.updatetodotask(id, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiBadRequestResponse()
  @Delete(':id')
  delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.toDoListService.deletetodotask(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ToDoList })
  @ApiBadRequestResponse()
  @Post('create')
  create(
    @Response() res,
    @Request() req,
    @Body() body: CreateToDoListDto,
  ): Promise<CreateToDoListDto> {
    // const userid = req.user.userId;
    //const todolist = this.toDoListService.createtodotask(body, userid);
    const todolist = this.toDoListService.createtodotask(body, req.user.userId);
    if (!todolist) {
      res.send('Please Login First');
    }
    return todolist;
  }
}
