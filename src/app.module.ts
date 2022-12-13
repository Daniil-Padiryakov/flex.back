import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nest-knexjs';
import { ProjectModule } from './project/project.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    KnexModule.forRoot({
      config: {
        client: 'pg',
        connection: {
          host: process.env.POSTGRES_HOST,
          user: process.env.POSTGRES_USER,
          password: process.env.POSTGRESS_PASSWORD,
          database: process.env.POSTGRES_DB,
          port: Number(process.env.POSTGRES_PORT),
        },
      },
    }),
    ProjectModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
