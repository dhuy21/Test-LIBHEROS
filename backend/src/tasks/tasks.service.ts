import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TaskList } from '../task-lists/models/task-list.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './models/task.model';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task) private taskModel: typeof Task,
    @InjectModel(TaskList) private taskListModel: typeof TaskList,
  ) {}

  private async verifyListOwnership(listId: number, userId: number) {
    const list = await this.taskListModel.findOne({
      where: { id: listId, userId },
    });
    if (!list) {
      throw new NotFoundException('Liste non trouvée');
    }
  }

  // Vérifier que la tâche appartient bien au user
  private async verifyTaskOwnership(taskId: number, userId: number) {
    const task = await this.taskModel.findByPk(taskId);
    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }
    const list = await this.taskListModel.findOne({
      where: { id: task.taskListId, userId },
    });
    if (!list) {
      throw new NotFoundException('Tâche non trouvée');
    }
    return task;
  }

  async create(listId: number, dto: CreateTaskDto, userId: number) {
    await this.verifyListOwnership(listId, userId);
    if (dto.dueDate) {
      const today = new Date().toISOString().split('T')[0];
      if (dto.dueDate < today) {
        throw new BadRequestException("La date d'échéance ne peut pas être dans le passé");
      }
    }
    return this.taskModel.create({
      shortDescription: dto.shortDescription.trim(),
      longDescription: dto.longDescription?.trim() || null,
      dueDate: dto.dueDate || null,
      taskListId: listId,
    } as any);
  }

  async findAllByList(listId: number, userId: number) {
    await this.verifyListOwnership(listId, userId);
    return this.taskModel.findAll({
      where: { taskListId: listId },
      order: [
        ['isCompleted', 'ASC'],
        ['dueDate', 'ASC'],
      ],
      attributes: [
        'id',
        'shortDescription',
        'longDescription',
        'dueDate',
        'isCompleted',
        'taskListId',
        'createdAt',
      ],
    });
  }

  async findOne(taskId: number, userId: number) {
    return this.verifyTaskOwnership(taskId, userId);
  }

  async update(taskId: number, dto: UpdateTaskDto, userId: number) {
    const task = await this.verifyTaskOwnership(taskId, userId);
    if (dto.shortDescription !== undefined) {
      task.shortDescription = dto.shortDescription.trim();
    }
    if (dto.longDescription !== undefined) {
      task.longDescription = dto.longDescription?.trim() || null;
    }
    if (dto.dueDate !== undefined) {
      if (dto.dueDate && dto.dueDate !== task.dueDate) {
        const today = new Date().toISOString().split('T')[0];
        if (dto.dueDate < today) {
          throw new BadRequestException("La date d'échéance ne peut pas être dans le passé");
        }
      }
      task.dueDate = dto.dueDate;
    }
    if (dto.isCompleted !== undefined) {
      task.isCompleted = dto.isCompleted;
    }
    await task.save();
    return task;
  }

  async remove(taskId: number, userId: number) {
    const task = await this.verifyTaskOwnership(taskId, userId);
    await task.destroy();
  }
}
