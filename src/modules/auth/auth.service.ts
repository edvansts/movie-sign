import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterBody } from '../user/user.validator';
import { LoginBody } from './auth.validator';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  ƒ;

  async signPayload(payload: LoginBody) {
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: LoginBody) {
    return await this.userService.findByPayload(payload);
  }

  async register(loginDto: RegisterBody) {
    const createdUser = await this.userService.create(loginDto);

    const token = await this.signPayload(createdUser);

    return { user: createdUser, token };
  }

  async login(userDto: LoginBody) {
    const user = await this.userService.findByLogin(userDto);

    const token = await this.signPayload({
      email: user.email,
      password: user.password,
    });

    return { user, token };
  }
}
