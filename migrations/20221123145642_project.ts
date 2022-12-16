import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('project', (table) => {
    table.increments('id');
    table.string('title', 255).notNullable();
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
  return knex.schema.dropTable('project');
}
