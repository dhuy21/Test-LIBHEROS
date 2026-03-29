import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TaskList } from './models/task-list.model';

@Module({
  imports: [SequelizeModule.forFeature([TaskList])],
  exports: [SequelizeModule],
})
export class TaskListsModule {}
