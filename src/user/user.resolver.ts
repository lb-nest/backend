import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { Project } from 'src/project/entities/project.entity';
import { GqlHeaders } from 'src/shared/decorators/gql-headers.decorator';
import { UpdateUserArgs } from './dto/update-user.args';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  user(@GqlHeaders('authorization') authorization: string): Observable<User> {
    return this.userService.findMe(authorization);
  }

  @Mutation(() => User)
  updateUser(
    @GqlHeaders('authorization') authorization: string,
    @Args() updateUserArgs: UpdateUserArgs,
  ): Observable<User> {
    return this.userService.update(authorization, updateUserArgs);
  }

  @Mutation(() => User)
  removeUser(
    @GqlHeaders('authorization') authorization: string,
  ): Observable<User> {
    return this.userService.remove(authorization);
  }

  @Query(() => [Project])
  userProjects(
    @GqlHeaders('authorization') authorization: string,
  ): Observable<Project[]> {
    return this.userService.findAllProjects(authorization);
  }
}
