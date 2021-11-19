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
import { CreateToDoDto } from './dtos/create-toDo.dto';
import { UpdateToDoDto } from './dtos/update-toDo.dto';
import { toDo } from './Entities/todo.entity';
import { ToDosService } from './todos.service';
import { AuthsService } from 'src/auth/auths.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetToDoDto } from './dtos/get-toDo.dto';

@ApiTags('todos')
@Controller('todos')
export class ToDosController {
  constructor(
    private authService: AuthsService,
    private toDoService: ToDosService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: toDo, isArray: true })
  @Get()
  getAllToDos(@Request() req): Promise<CreateToDoDto[]> {
    return this.toDoService.findAll(req.user.userId);
  }

  @ApiOkResponse({ type: toDo })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse()
  @Get('/:id')
  getToDo(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetToDoDto> {
    return this.toDoService.findById(id, req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBadRequestResponse()
  @Put('/:id')
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
  @Delete('/:id')
  deleteToDo(@Request() req, @Param('id') id: number): Promise<DeleteResult> {
    return this.toDoService.deleteToDo(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: toDo })
  @ApiBadRequestResponse()
  @Post()
  async createToDo(
    // @Response() res,
    @Request() req,
    @Body() body: CreateToDoDto,
  ) {
    const todo = await this.toDoService.createToDo(body, req.user.userId);
    return todo;
  }
}
