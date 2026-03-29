import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './models/task.model';
import { TaskList } from '../task-lists/models/task-list.model';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [SequelizeModule.forFeature([Task, TaskList])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
