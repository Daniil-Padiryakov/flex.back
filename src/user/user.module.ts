import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProjectService } from '../project/project.service';

@Module({
  controllers: [UserController],
  providers: [UserService, ProjectService],
  exports: [UserService],
})
export class UserModule {}
