import {
  Body,
  Controller,
  Delete,
  Response,
  Get,
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
import { Public } from 'src/auth/constants';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateToDoDto } from './dto/create-toDo.dto';
import { UpdateToDoDto } from './dto/update-toDo.dto';
import { ToDo } from './Entities/toDo.entity';
import { ToDoService } from './toDo.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('todo')
@Controller('todo')
export class ToDoController {
  constructor(
    private authservice: AuthService,
    private toDoService: ToDoService,
  ) {}

  @Public()
  @ApiBearerAuth()
  @ApiOkResponse({ type: ToDo, isArray: true })
  @Get('all')
  getusers(): Promise<CreateToDoDto[]> {
    return this.toDoService.findAll();
  }

  @ApiOkResponse({ type: ToDo })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse()
  @Get(':id')
  getUserById(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CreateToDoDto> {
    const userid = req.user.userId;
    if (userid) {
      return this.toDoService.findById(id, userid);
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
    @Body() updateUserDto: UpdateToDoDto,
  ): Promise<UpdateResult> {
    return this.toDoService.updatetodotask(id, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiBadRequestResponse()
  @Delete(':id')
  delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.toDoService.deletetodotask(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ToDo })
  @ApiBadRequestResponse()
  @Post('create')
  create(
    @Response() res,
    @Request() req,
    @Body() body: CreateToDoDto,
  ): Promise<CreateToDoDto> {
    // const userid = req.user.userId;
    //const todolist = this.toDoListService.createtodotask(body, userid);
    const todolist = this.toDoService.createtodotask(body, req.user.userId);
    if (!todolist) {
      res.send('Please Login First');
    }
    return todolist;
  }
}
