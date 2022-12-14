import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';

@Injectable()
export class UserService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  create(createUserDto: CreateUserDto) {
    return this.knex('user').returning('*').insert(createUserDto);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findByUsername(username: string) {
    return this.knex('user').where('username', username).first();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.knex('user').returning('*').where('id', id).update({
      updateUserDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
