import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const adminExists = await this.userModel.findOne({ username: 'admin' });
    if (!adminExists) {
      console.log('Seeding default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new this.userModel({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
      });
      await admin.save();
      console.log('Default admin user seeded (admin/admin123).');
    }
  }

  async findOne(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async create(createUserDto: any): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }
}
