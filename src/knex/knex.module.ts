import { Module, Global } from '@nestjs/common';
import knex, { Knex } from 'knex';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: 'KnexConnection',
      useFactory: async (configService: ConfigService): Promise<Knex> => {
        const knexInstance = knex({
          client: 'pg',
          connection: {
            host: configService.get<string>('DATABASE_HOST', 'localhost'),
            port: configService.get<number>('DATABASE_PORT', 5432),
            user: configService.get<string>('DATABASE_USER', 'flex'),
            password: configService.get<string>('DATABASE_PASSWORD', 'flex'),
            database: configService.get<string>('DATABASE_NAME', 'flex'),
          },
        });

        // Проверяем подключение
        try {
          await knexInstance.raw('SELECT 1+1 AS result');
          console.log('Knex подключился к базе данных успешно!');
        } catch (error) {
          console.error(
            'Ошибка подключения Knex к базе данных:',
            error.message,
          );
          throw error;
        }

        return knexInstance;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['KnexConnection'],
})
export class KnexModule {}
