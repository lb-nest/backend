import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SigninInput } from './dto/signin.input';
import { SignupInput } from './dto/signup.input';
import { Token } from './entities/token.entity';

@Resolver(() => Token)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Token)
  signUp(@Args() signupInput: SignupInput) {
    return this.authService.signUp(signupInput);
  }

  @Mutation(() => Token)
  signIn(@Args() signinInput: SigninInput) {
    return this.authService.signIn(signinInput);
  }
}
