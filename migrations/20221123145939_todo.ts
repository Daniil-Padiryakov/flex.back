import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('todo', (table) => {
    table.increments('id');
    table.string('title', 255).notNullable();
    table.boolean('is_done').defaultTo(false);
    table.integer('parent_id').defaultTo(0);
    table.string('parent_title').defaultTo('');
    table
      .integer('project_id')
      .notNullable()
      .references('id')
      .inTable('project')
      .onUpdate('cascade')
      .onDelete('cascade');
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
  return knex.schema.dropTable('todo');
}
