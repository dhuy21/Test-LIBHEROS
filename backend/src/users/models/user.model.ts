import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { TaskList } from '../../task-lists/models/task-list.model';

@Table({ tableName: 'users', underscored: true })
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @HasMany(() => TaskList)
  declare taskLists: TaskList[];
}
