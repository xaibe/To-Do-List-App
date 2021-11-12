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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateToDoDto } from './dto/create-toDo.dto';
import { UpdateToDoDto } from './dto/update-toDo.dto';
import { ToDo } from './Entities/todo.entity';
import { ToDosService } from './todos.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetToDoDto } from './dto/get-toDo.dto';

@ApiTags('todos')
@Controller('todos')
export class ToDosController {
  constructor(
    private authservice: AuthService,
    private toDoService: ToDosService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ToDo, isArray: true })
  @Get('all')
  getAllToDos(@Request() req): Promise<CreateToDoDto[]> {
    return this.toDoService.findAll(req.user.userId);
  }

  @ApiOkResponse({ type: ToDo })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse()
  @Get(':id')
  getToDo(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetToDoDto> {
    return this.toDoService.findById(id, req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBadRequestResponse()
  @Put('update/:id')
  updateToDo(
    @Request() req,
    @Param('id') id: number,
    @Body() updateUserDto: UpdateToDoDto,
  ): Promise<UpdateResult> {
    return this.toDoService.updateToDo(id, req.user.userId, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBadRequestResponse()
  @Delete('delete/:id')
  deleteToDo(@Request() req, @Param('id') id: number): Promise<DeleteResult> {
    return this.toDoService.deleteToDo(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ToDo })
  @ApiBadRequestResponse()
  @Post('create')
  async createToDo(
    // @Response() res,
    @Request() req,
    @Body() body: CreateToDoDto,
  ) {
    const todo = await this.toDoService.createToDo(body, req.user.userId);
    return todo;
  }
}
