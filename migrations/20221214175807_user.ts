import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user', (table) => {
    table.increments('id');
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password').notNullable().unique();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user');
}
