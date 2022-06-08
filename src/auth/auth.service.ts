import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { SigninInput } from './dto/signin.input';
import { SignupInput } from './dto/signup.input';
import { Token } from './entities/token.entity';

@Injectable()
export class AuthService {
  private readonly axios: AxiosInstance;

  constructor(configService: ConfigService) {
    this.axios = axios.create({
      baseURL: configService.get<string>('AUTH_URL'),
    });
  }

  async signUp(input: SignupInput): Promise<Token> {
    try {
      await this.axios.post('/users', input);
      return this.signIn(input);
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async signIn(input: SigninInput): Promise<Token> {
    try {
      const res = await this.axios.post('/auth/signin', input);
      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }
}
