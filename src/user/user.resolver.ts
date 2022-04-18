import { Headers } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Project } from 'src/project/entities/project.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  user(@Headers('authorization') authorization: string) {
    return this.userService.getByToken(authorization);
  }

  @Query(() => [Project])
  userProjects(@Headers('authorization') authorization: string) {
    return this.userService.getProjects(authorization);
  }

  @Mutation(() => User)
  updateUser(
    @Headers('authorization') authorization: string,
    @Args() input: UpdateUserInput,
  ) {
    return this.userService.update(authorization, input);
  }

  @Mutation(() => User)
  removeUser(@Headers('authorization') authorization: string) {
    return this.userService.remove(authorization);
  }
}
