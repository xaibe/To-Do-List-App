import { Module } from '@nestjs/common';
import { ToDosController } from './todos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToDo } from './Entities/todo.entity';
import { ToDosService } from './todos.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ToDo]), AuthModule],
  controllers: [ToDosController],
  providers: [ToDosService],
  exports: [ToDosService],
})
export class ToDosModule {}
