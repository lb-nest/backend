import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BearerAuth } from 'src/auth/decorators/bearer-auth.decorator';
import { BearerAuthGuard } from 'src/auth/guargs/bearer-auth.guard';
import { Auth } from 'src/auth/interfaces/auth.interface';
import { Project } from 'src/project/entities/project.entity';
import { UpdateUserArgs } from './dto/update-user.args';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(BearerAuthGuard)
  @Query(() => User)
  user(@BearerAuth() auth: Auth): Observable<User> {
    return this.userService.findOne(auth.id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => User)
  updateUser(
    @BearerAuth() auth: Auth,
    @Args() updateUserArgs: UpdateUserArgs,
  ): Observable<User> {
    return this.userService.update(auth.id, updateUserArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => User)
  removeUser(@BearerAuth() auth: Auth): Observable<User> {
    return this.userService.remove(auth.id);
  }

  @Mutation(() => User)
  confirmUser(
    @Args('code', { type: () => String }) code: string,
  ): Observable<boolean> {
    return this.userService.confirm(code);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Project])
  userProjects(@BearerAuth() auth: Auth): Observable<Project[]> {
    return this.userService.findAllProjects(auth.id);
  }
}
