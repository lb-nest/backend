import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { Token } from 'src/auth/entities/token.entity';
import { User } from 'src/auth/user.decorator';
import { User as UserEntity } from 'src/user/entities/user.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { InviteInput } from './dto/invite.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { ProjectWithToken } from './entities/project-with-token.entity';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => ProjectWithToken)
  createProject(
    @User() user: any,
    @Args() input: CreateProjectInput,
  ): Promise<ProjectWithToken> {
    return this.projectService.create(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Token)
  signInProject(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Token> {
    return this.projectService.signIn(user, id);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Project)
  project(@User() user: any): Promise<Project> {
    return this.projectService.findMe(user);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Project)
  updateProject(
    @User() user: any,
    @Args() input: UpdateProjectInput,
  ): Promise<Project> {
    return this.projectService.update(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Project)
  removeProject(@User() user: any): Promise<Project> {
    return this.projectService.remove(user);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Boolean)
  invite(@User() user: any, @Args() input: InviteInput): Promise<boolean> {
    return this.projectService.invite(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [UserEntity])
  projectUsers(@User() user: any): Promise<UserEntity[]> {
    return this.projectService.findAllUsers(user);
  }
}
