import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UpdateIsCompletedTodoDto } from './dto/update-is-completed-todo.dto';
import { ChangeProjectTodoDto } from './dto/change-project-todo.dto';
import { User } from '../project/project.controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@User() user_id: number) {
    return this.todoService.findAll(user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const idArrString = id.split(',');
    const result = [];

    for (let i = 0; i < idArrString.length; i++) {
      result.push(Number(idArrString[i]));
    }
    console.log(result);
    return this.todoService.remove(result);
  }

  @Patch('complete/:id')
  updateIsCompleted(
    @Param('id') id: string,
    @Body() updateIsCompletedTodoDto: UpdateIsCompletedTodoDto,
  ) {
    return this.todoService.updateIsCompleted(+id, updateIsCompletedTodoDto);
  }

  @Patch('change-project/:id')
  changeProject(
    @Param('id') id: string,
    @Body() changeProjectTodoDto: ChangeProjectTodoDto,
  ) {
    return this.todoService.changeProject(+id, changeProjectTodoDto);
  }
}
