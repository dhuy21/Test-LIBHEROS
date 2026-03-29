import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './models/task.model';

@Module({
  imports: [SequelizeModule.forFeature([Task])],
  exports: [SequelizeModule],
})
export class TasksModule {}
