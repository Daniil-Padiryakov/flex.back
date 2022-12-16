import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';

@Injectable()
export class UserService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  create(createUserDto: CreateUserDto) {
    return this.knex('user')
      .insert(createUserDto)
      .returning('*')
      .then((res) => res[0]);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findByUsername(username: string) {
    return this.knex('user').where('username', username).first();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {}

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
