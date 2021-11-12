import { Module } from '@nestjs/common';
import { ToDoController } from './toDo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToDo } from './Entities/toDo.entity';
import { ToDoService } from './toDo.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ToDo]), AuthModule],
  controllers: [ToDoController],
  providers: [ToDoService],
  exports: [ToDoService],
})
export class ToDoModule {}
