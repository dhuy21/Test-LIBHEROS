import {
  Column, Model, Table, DataType,
  ForeignKey, BelongsTo, HasMany,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Task } from '../../tasks/models/task.model';

@Table({
  tableName: 'task_lists',
  underscored: true,
  indexes: [{ unique: true, fields: ['name', 'user_id'] }],
})
export class TaskList extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  @HasMany(() => Task)
  declare tasks: Task[];
}
