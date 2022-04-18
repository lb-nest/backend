import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SigninInput } from './dto/signin.input';
import { SignupInput } from './dto/signup.input';

@Injectable()
export class AuthService {
  private readonly authUrl: string;

  constructor(configService: ConfigService) {
    this.authUrl = configService.get<string>('AUTH_URL');
  }

  async signUp(input: SignupInput) {
    try {
      await axios.post(this.authUrl.concat('/users'), input);

      const res = await axios.post(this.authUrl.concat('/auth/login'), input);
      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async signIn(input: SigninInput) {
    try {
      const res = await axios.post(this.authUrl.concat('/auth/login'), input);
      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }
}
