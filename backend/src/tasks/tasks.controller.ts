import {
  Controller, Post, Get, Patch, Delete,
  Body, Param, UseGuards, Request, ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post('task-lists/:listId/tasks')
  create(
    @Param('listId', ParseIntPipe) listId: number,
    @Body() dto: CreateTaskDto,
    @Request() req,
  ) {
    return this.tasksService.create(listId, dto, req.user.id);
  }

  @Get('task-lists/:listId/tasks')
  findAllByList(
    @Param('listId', ParseIntPipe) listId: number,
    @Request() req,
  ) {
    return this.tasksService.findAllByList(listId, req.user.id);
  }

  @Get('tasks/:id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tasksService.findOne(id, req.user.id);
  }

  @Patch('tasks/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @Request() req,
  ) {
    return this.tasksService.update(id, dto, req.user.id);
  }

  @Delete('tasks/:id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.tasksService.remove(id, req.user.id);
    return { message: 'Tâche supprimée' };
  }
}
