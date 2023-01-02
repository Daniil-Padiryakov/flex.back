import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { ProjectService } from '../project/project.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TodoController],
  providers: [TodoService, ProjectService],
})
export class TodoModule {}
