import {
  Controller, Post, Get, Patch, Delete,
  Body, Param, UseGuards, Request, ParseIntPipe,
} from '@nestjs/common';
import { TaskListsService } from './task-lists.service';
import { CreateTaskListDto } from './dto/create-task-list.dto';
import { UpdateTaskListDto } from './dto/update-task-list.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('task-lists')
@UseGuards(JwtAuthGuard)
export class TaskListsController {
  constructor(private taskListsService: TaskListsService) {}

  @Post()
  create(@Body() dto: CreateTaskListDto, @Request() req) {
    return this.taskListsService.create(dto.name, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.taskListsService.findAllByUser(req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskListDto,
    @Request() req,
  ) {
    return this.taskListsService.update(id, dto.name, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.taskListsService.remove(id, req.user.id);
    return { message: 'Liste supprimée' };
  }
}
