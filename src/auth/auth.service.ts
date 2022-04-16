import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SigninInput } from './dto/signin.input';
import { SignupInput } from './dto/signup.input';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  async signUp(input: SignupInput) {
    const url = this.configService.get<string>('AUTH_URL');

    try {
      await axios.post(url.concat('/users'), input);

      const res = await axios.post(url.concat('/auth/login'), input);
      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async signIn(input: SigninInput) {
    const url = this.configService.get<string>('AUTH_URL');

    try {
      const res = await axios.post(url.concat('/auth/login'), input);
      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }
}
