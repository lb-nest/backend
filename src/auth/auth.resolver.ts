import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { SigninArgs } from './dto/signin.args';
import { SignupArgs } from './dto/signup.args';
import { Token } from './entities/token.entity';

@Resolver(() => Token)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Token)
  signUp(@Args() signupArgs: SignupArgs): Observable<Token> {
    return this.authService.signUp(signupArgs);
  }

  @Mutation(() => Token)
  signIn(@Args() signinArgs: SigninArgs): Observable<Token> {
    return this.authService.signIn(signinArgs);
  }
}
