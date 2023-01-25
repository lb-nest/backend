import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { concat, Observable } from 'rxjs';
import { AUTH_SERVICE } from 'src/shared/constants/broker';
import { SignInArgs } from './dto/sign-in.args';
import { SignUpArgs } from './dto/sign-up.args';
import { Token } from './entities/token.entity';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}

  signUp(signUpArgs: SignUpArgs): Observable<Token> {
    return concat(
      this.client.send('createUser', signUpArgs),
      this.signIn(signUpArgs),
    );
  }

  signIn(signInArgs: SignInArgs): Observable<Token> {
    return this.client.send<Token>('signIn', signInArgs);
  }
}
