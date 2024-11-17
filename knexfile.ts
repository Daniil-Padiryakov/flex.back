import { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg', // Клиент базы данных (PostgreSQL)
    connection: {
      host: 'localhost', // Адрес сервера базы данных
      port: 5432, // Порт подключения
      user: 'flex', // Имя пользователя базы данных
      password: 'flex', // Пароль пользователя
      database: 'flex', // Имя базы данных
    },
    migrations: {
      tableName: 'knex_migrations', // Таблица для хранения миграций
      directory: './migrations', // Папка для миграций
    },
    seeds: {
      directory: './seeds', // Папка для сидов (тестовые данные)
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL, // В продакшне лучше использовать переменные окружения
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};

module.exports = config;
