import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { concat, Observable } from 'rxjs';
import { AUTH_SERVICE } from 'src/shared/constants/broker';
import { SigninArgs } from './dto/signin.args';
import { SignupArgs } from './dto/signup.args';
import { Token } from './entities/token.entity';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}

  signUp(signupArgs: SignupArgs): Observable<Token> {
    return concat(
      this.client.send('users.create', {
        payload: signupArgs,
      }),
      this.signIn(signupArgs),
    );
  }

  signIn(signinArgs: SigninArgs): Observable<Token> {
    return this.client.send<Token>('auth.signIn', {
      payload: signinArgs,
    });
  }
}
