import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  async create(data: { firstName: string; lastName: string; email: string; password: string }) {
    return this.userModel.create(data as any);
  }
}
