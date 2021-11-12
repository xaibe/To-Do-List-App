import { Module } from '@nestjs/common';
import { ToDosController } from './todos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { toDo } from './Entities/todo.entity';
import { ToDosService } from './todos.service';
import { AuthModule } from 'src/auth/auths.module';

@Module({
  imports: [TypeOrmModule.forFeature([toDo]), AuthModule],
  controllers: [ToDosController],
  providers: [ToDosService],
  exports: [ToDosService],
})
export class ToDosModule {}