import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { Knex } from 'knex';

@Injectable()
export class UserService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.knex('user')
      .insert(createUserDto)
      .returning(['id', 'email', 'username'])
      .then((res) => res[0]);
    // const inboxProject = await this.projectService.create({
    //   title: 'Inbox',
    //   user_id: user.id,
    // });
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findById(id: number) {
    return this.knex('user').where('id', id).first();
  }

  async findByUsername(username: string) {
    return this.knex('user').where('username', username).first();
  }

  // async update(id: string, updateUserDto: UpdateUserDto) {}

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
