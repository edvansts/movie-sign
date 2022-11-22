import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { isEmail } from 'class-validator';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { LoginBody } from '../auth/auth.validator';
import { RegisterBody, RegisterWithGoogle } from './user.validator';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(payload: RegisterBody) {
    const { email, username } = payload;

    const userExists = this.userExists({ email, username });

    if (userExists) {
      throw new HttpException('Usuário já existe', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel(payload);

    await createdUser.save();

    return this.sanitizeUser(createdUser.toObject());
  }

  async createWithGoogle(payload: RegisterWithGoogle) {
    const { email, username } = payload;

    const userExists = await this.userExists({ email, username });

    if (userExists) {
      throw new HttpException('Usuário já existe', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel({
      ...payload,
      isRegisteredWithGoogle: true,
    });

    await createdUser.save();

    return this.sanitizeUser(createdUser.toObject());
  }

  private async userExists(data: { username?: string; email?: string }) {
    const { email, username } = data;

    const user = await this.userModel.findOne(
      {
        $or: [{ email }, { username }],
      },
      { _id: 1 },
    );

    return !!user;
  }

  async findByLogin(userDto: LoginBody) {
    const { user: login, password } = userDto;

    const userKey = isEmail(login) ? 'email' : 'username';

    const user = await this.userModel.findOne({ [userKey]: login });

    if (!user) {
      throw new HttpException('Usuário não existe', HttpStatus.BAD_REQUEST);
    }

    const isPasswordCorrectly = await compare(password, user.password);

    if (!isPasswordCorrectly) {
      throw new HttpException('Senha incorreta', HttpStatus.BAD_REQUEST);
    }

    return this.sanitizeUser(user.toObject());
  }

  private sanitizeUser(user: User) {
    const sanitized = user;

    delete sanitized.password;
    delete sanitized.createdAt;
    delete sanitized.updatedAt;

    return sanitized;
  }

  async findByPayload(payload: LoginBody) {
    const { user } = payload;

    const userKey = isEmail(user) ? 'email' : 'username';

    return await this.userModel.findOne({ [userKey]: user });
  }

  async findByKeys(data: { username?: string; email?: string }) {
    const { email, username } = data;

    if (!email && !username) {
      return null;
    }

    return await this.userModel.findOne({ email, username });
  }
}
