import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('token', (table) => {
    table.increments('id');
    table.string('refresh_token').notNullable();
    table
      .integer('user_id')
      .notNullable()
      .references('id')
      .inTable('user')
      .onUpdate('cascade')
      .onDelete('cascade');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('token');
}
