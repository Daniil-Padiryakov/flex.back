import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { ProjectService } from '../project/project.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService, ProjectService],
})
export class TodoModule {}
