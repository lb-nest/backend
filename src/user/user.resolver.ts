import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { User } from 'src/auth/user.decorator';
import { Project } from 'src/project/entities/project.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { User as UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(BearerAuthGuard)
  @Query(() => UserEntity)
  user(@User() user: any): Observable<UserEntity> {
    return this.userService.findMe(user);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Project])
  userProjects(@User() user: any): Observable<Project[]> {
    return this.userService.findAllProjects(user);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => UserEntity)
  updateUser(
    @User() user: any,
    @Args() input: UpdateUserInput,
  ): Observable<UserEntity> {
    return this.userService.update(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => UserEntity)
  removeUser(@User() user: any): Observable<UserEntity> {
    return this.userService.remove(user);
  }
}
