import {
  Column, Model, Table, DataType,
  ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import { TaskList } from '../../task-lists/models/task-list.model';

@Table({ tableName: 'tasks', underscored: true })
export class Task extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare shortDescription: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare longDescription: string | null;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare dueDate: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isCompleted: boolean;

  @ForeignKey(() => TaskList)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  declare taskListId: number;

  @BelongsTo(() => TaskList)
  declare taskList: TaskList;
}
