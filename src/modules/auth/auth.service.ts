import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterBody } from '../user/user.validator';
import { LoginBody } from './auth.validator';
import { SignPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  ƒ;

  async signPayload(payload: SignPayload) {
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: LoginBody) {
    return await this.userService.findByPayload(payload);
  }

  async register(registerDto: RegisterBody) {
    const createdUser = await this.userService.create(registerDto);

    const { email, password } = createdUser;

    const token = await this.signPayload({ email, password });

    return { user: createdUser, token };
  }

  async login(dtoUser: LoginBody) {
    const user = await this.userService.findByLogin(dtoUser);

    const token = await this.signPayload({
      email: user.email,
      password: user.password,
    });

    return { user, token };
  }
}
