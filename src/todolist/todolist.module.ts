import { Module } from '@nestjs/common';
import { ToDoListController } from './controllers/todolist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToDoList } from './models/todolist.entity';
import { ToDoListService } from './services/todolist.service';

@Module({
  imports: [TypeOrmModule.forFeature([ToDoList])],
  controllers: [ToDoListController],
  providers: [ToDoListService],
  exports: [ToDoListService],
})
export class ToDoListModule {}
