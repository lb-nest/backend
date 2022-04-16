import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Project } from 'src/project/entities/project.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  user(@Context() context: any) {
    return this.userService.getByToken(context.req.headers.authorization);
  }

  @Query(() => [Project])
  userProjects(@Context() context: any) {
    return this.userService.getProjects(context.req.headers.authorization);
  }

  @Mutation(() => User)
  updateUser(@Context() context: any, @Args() input: UpdateUserInput) {
    return this.userService.update(context.req.headers.authorization, input);
  }

  @Mutation(() => User)
  removeUser(@Context() context: any) {
    return this.userService.remove(context.req.headers.authorization);
  }
}
