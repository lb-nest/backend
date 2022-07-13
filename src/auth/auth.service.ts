import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AUTH_SERVICE } from 'src/shared/rabbitmq/constants';
import { SigninInput } from './dto/signin.input';
import { SignupInput } from './dto/signup.input';
import { Token } from './entities/token.entity';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}

  async signUp(input: SignupInput): Promise<Token> {
    try {
      await lastValueFrom(
        this.client.send('users.create', {
          data: input,
        }),
      );

      return this.signIn(input);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async signIn(input: SigninInput): Promise<Token> {
    try {
      return await lastValueFrom(
        this.client.send('auth.signin', {
          data: input,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
