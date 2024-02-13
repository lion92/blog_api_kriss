import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '../entity/todo.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entity/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, User])],
  controllers: [TodosController],
  providers: [Repository, TodosService, JwtService],
})
export class TodosModule {}
