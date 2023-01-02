import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async create(createProjectDto: CreateProjectDto) {
    const { title, user_id } = createProjectDto;
    const [createdProject] = await this.knex('project').returning('*').insert({
      title,
      user_id,
    });
    return createdProject;
  }

  async findAll(user_id) {
    // const todos = await this.knex('todo');
    const projects = await this.knex('project').where('user_id', user_id);
    return projects;
    // const projectsWithTodos = projects.map((project) => {
    //   project.todos = [];
    //
    //   for (let i = 0; i < todos.length; i++) {
    //     if (todos[i].project_id === project.id) {
    //       project.todos.push(todos[i]);
    //     }
    //   }
    //   return project;
    // });
    // return projectsWithTodos;
  }

  findOne(id: number) {
    return this.knex<any, Project>('project').where('id', id).first();
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
