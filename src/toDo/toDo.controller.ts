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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ToDo, isArray: true })
  @Get('all')
  getUsers(@Request() req): Promise<CreateToDoDto[]> {
    return this.toDoService.findAll(req.user.userId);
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
  updateToDo(
    @Request() req,
    @Param('id') id: number,
    @Body() updateUserDto: UpdateToDoDto,
  ): Promise<UpdateResult> {
    return this.toDoService.updateToDo(id, req.user.userId, updateUserDto);
  }

  @ApiBearerAuth()
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
  createToDo(
    @Response() res,
    @Request() req,
    @Body() body: CreateToDoDto,
  ): Promise<CreateToDoDto> {
    return this.toDoService.createToDo(body, req.user.userId);
  }
}
