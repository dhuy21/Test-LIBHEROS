import {
  Column, Model, Table, DataType,
  ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import { TaskList } from '../../task-lists/models/task-list.model';

@Table({ tableName: 'tasks' })
export class Task extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'short_description',
  })
  shortDescription: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'long_description',
  })
  longDescription: string | null;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'due_date',
  })
  dueDate: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_completed',
  })
  isCompleted: boolean;

  @ForeignKey(() => TaskList)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'task_list_id',
    onDelete: 'CASCADE',
  })
  taskListId: number;

  @BelongsTo(() => TaskList)
  taskList: TaskList;
}
