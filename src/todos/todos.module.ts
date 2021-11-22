import { Module } from '@nestjs/common';
import { ToDosController } from './todos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToDosService } from './todos.service';
import { AuthsModule } from 'src/auth/auths.module';
import { TodosRepository } from './repositories/todos.repositories';

@Module({
  imports: [TypeOrmModule.forFeature([TodosRepository]), AuthsModule],
  controllers: [ToDosController],
  providers: [ToDosService],
  exports: [ToDosService],
})
export class ToDosModule {}
