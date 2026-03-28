import {
  Column, Model, Table, DataType,
  ForeignKey, BelongsTo, HasMany,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Task } from '../../tasks/models/task.model';

@Table({
  tableName: 'task_lists',
  indexes: [{ unique: true, fields: ['name', 'user_id'] }],
})
export class TaskList extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id',
    onDelete: 'CASCADE',
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Task)
  tasks: Task[];
}
