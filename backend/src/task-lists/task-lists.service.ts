import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UniqueConstraintError } from 'sequelize';
import { TaskList } from './models/task-list.model';

@Injectable()
export class TaskListsService {
  constructor(
    @InjectModel(TaskList) private taskListModel: typeof TaskList,
  ) {}

  async create(name: string, userId: number) {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new BadRequestException('Le nom ne peut pas être vide');
    }
    try {
      return await this.taskListModel.create({ name: trimmed, userId } as any);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException('Une liste avec ce nom existe déjà');
      }
      throw error;
    }
  }

  async findAllByUser(userId: number) {
    return this.taskListModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'createdAt'],
    });
  }

  async remove(id: number, userId: number) {
    const list = await this.taskListModel.findOne({ where: { id, userId } });
    if (!list) {
      throw new NotFoundException('Liste non trouvée');
    }
    await list.destroy();
  }
}
