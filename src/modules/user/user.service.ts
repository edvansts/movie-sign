import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { LoginBody } from '../auth/auth.validator';
import { RegisterBody } from './user.validator';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(payload: RegisterBody) {
    const { email } = payload;

    const user = await this.userModel.findOne({ email });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel(payload);

    await createdUser.save();

    return this.sanitizeUser(createdUser.toObject());
  }

  async findByLogin(userDto: LoginBody) {
    const { email, password } = userDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }

    const isPasswordCorrectly = await compare(password, user.password);

    if (!isPasswordCorrectly) {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }

    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: User) {
    const sanitized = user;

    delete sanitized.password;
    delete sanitized.createdAt;
    delete sanitized.updatedAt;

    return sanitized;
  }

  async findByPayload(payload: LoginBody) {
    const { email } = payload;

    return await this.userModel.findOne({ email });
  }
}
