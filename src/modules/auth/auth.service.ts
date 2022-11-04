import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterBody } from '../user/user.validator';
import { LoginBody } from './auth.validator';
import { SignPayload, TokenData } from './types';

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

  async validateTokenData(payload: TokenData) {
    return await this.userService.findByKeys(payload);
  }

  async register(registerDto: RegisterBody) {
    const createdUser = await this.userService.create(registerDto);

    const { email, password, username } = createdUser;

    const token = await this.signPayload({ email, password, username });

    return { user: createdUser, token };
  }

  async login(dtoUser: LoginBody) {
    const user = await this.userService.findByLogin(dtoUser);

    const token = await this.signPayload({
      username: user.username,
      email: user.email,
      password: user.password,
    });

    return { user, token };
  }
}
