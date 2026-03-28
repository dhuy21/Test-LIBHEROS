import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { TaskList } from '../../task-lists/models/task-list.model';

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'first_name',
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'last_name',
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasMany(() => TaskList)
  taskLists: TaskList[];
}
