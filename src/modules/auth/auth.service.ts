import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterBody } from '../user/user.validator';
import { LoginBody, SignWithGoogleBody } from './auth.validator';
import { SignPayload, TokenData } from './types';
import { Auth, google } from 'googleapis';
import { transformToUsername } from 'src/helpers';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  oauthClient: Auth.OAuth2Client;

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

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

  async signWithGoogle(data: SignWithGoogleBody) {
    try {
      const { token } = data;

      const tokenInfo = await this.oauthClient.getTokenInfo(token);

      const email = tokenInfo.email;

      const user = await this.userService.findByKeys({ email });

      if (!user) {
        return this.registerWithGoogle(token, email);
      }

      return this.handleRegisteredGoogleUser(user.toObject());
    } catch (error) {
      throw error;
    }
  }

  async registerWithGoogle(token: string, email: string) {
    const userData = await this.getGoogleUserData(token);
    const { name } = userData;

    const username = transformToUsername(name);

    const user = await this.userService.createWithGoogle({
      email,
      name,
      username,
    });

    return this.handleRegisteredGoogleUser(user);
  }

  async getGoogleUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });

    return userInfoResponse.data;
  }

  async handleRegisteredGoogleUser(user: User) {
    if (!user.isRegisteredWithGoogle) {
      throw new UnauthorizedException();
    }

    const token = await this.signPayload(user);

    return {
      token,
      user,
    };
  }
}
