import { Module } from '@nestjs/common';
import { ToDoListController } from './controllers/todolist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToDoList } from './models/todolist.entity';
import { ToDoListService } from './services/todolist.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ToDoList]), AuthModule],
  controllers: [ToDoListController],
  providers: [ToDoListService],
  exports: [ToDoListService],
})
export class ToDoListModule {}
