import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { SignInArgs } from './dto/sign-in.args';
import { SignUpArgs } from './dto/sign-up.args';
import { Token } from './entities/token.entity';

@Resolver(() => Token)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Token)
  signUp(@Args() signUpArgs: SignUpArgs): Observable<Token> {
    return this.authService.signUp(signUpArgs);
  }

  @Mutation(() => Token)
  signIn(@Args() signInArgs: SignInArgs): Observable<Token> {
    return this.authService.signIn(signInArgs);
  }
}
