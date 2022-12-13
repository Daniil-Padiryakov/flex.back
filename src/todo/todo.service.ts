import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';
import { ProjectService } from '../project/project.service';
import { UpdateIsCompletedTodoDto } from './dto/update-is-completed-todo.dto';
import { ChangeProjectTodoDto } from './dto/change-project-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private projectService: ProjectService,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    const { title, project_id, parent_id } = createTodoDto;
    const { id } = await this.projectService.findOne(project_id);

    const [createdTodo]: any = await this.knex('todo').returning('*').insert({
      title,
      project_id: id,
      parent_id,
    });
    createdTodo.children = [];
    return createdTodo;
  }

  async findAll() {
    const todos = await this.knex('todo');
    for (let i = 0; i < todos.length; i++) {
      todos[i].children = [];
    }
    // const parseTodos = (todos) => {
    //   const todosIdsByIndex = {};
    //   const roots = [];
    //   let todo;
    //   let i;
    //
    //   for (i = 0; i < todos.length; i++) {
    //     todosIdsByIndex[todos[i].id] = i;
    //     todos[i].children = [];
    //     // todos[i].depth = 1;
    //   }
    //
    //   for (i = 0; i < todos.length; i++) {
    //     // let depth = 1;
    //     todo = todos[i];
    //     if (todo.parent_id !== 0) {
    //       // depth = todos[todosIdsByIndex[todo.parent_id]].depth;
    //       // depth++;
    //       // todo.depth = depth;
    //       todos[todosIdsByIndex[todo.parent_id]].children.push(todo);
    //     } else {
    //       roots.push(todo);
    //     }
    //   }
    //   return roots;
    // };
    return todos;
  }

  findOne(id: number) {
    return `This action returns a #${id} todo`;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  async remove(id: number[]) {
    if (!id) {
      throw new Error('Не был указан ID todo');
    }
    const idDeletedTodo: any = await this.knex('todo')
      .returning('id')
      .whereIn('id', id)
      .delete();
    return [idDeletedTodo];
  }

  updateIsCompleted(
    id: number,
    updateIsCompletedTodoDto: UpdateIsCompletedTodoDto,
  ) {
    const isCompleted = updateIsCompletedTodoDto.is_completed;
    return this.knex('todo').where('id', id).update({
      is_done: isCompleted,
    });
  }

  changeProject(id: number, changeProjectTodoDto: ChangeProjectTodoDto) {
    const { project_id, parent_title } = changeProjectTodoDto;
    return this.knex('todo').where('id', id).update({
      project_id: project_id,
      parent_title: parent_title,
      parent_id: 0,
    });
  }
}
