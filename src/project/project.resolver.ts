import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { Token } from 'src/auth/entities/token.entity';
import { GqlHeaders } from 'src/shared/decorators/gql-headers.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateProjectArgs } from './dto/create-project.args';
import { InviteUserArgs } from './dto/invite-user.args';
import { UpdateProjectArgs } from './dto/update-project.args';
import { ProjectWithToken } from './entities/project-with-token.entity';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => ProjectWithToken)
  createProject(
    @GqlHeaders('authorization') authorization: string,
    @Args() createProjectArgs: CreateProjectArgs,
  ): Promise<ProjectWithToken> {
    return this.projectService.create(authorization, createProjectArgs);
  }

  @Mutation(() => Token)
  signInProject(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Token> {
    return this.projectService.signIn(authorization, id);
  }

  @Query(() => Project)
  project(
    @GqlHeaders('authorization') authorization: string,
  ): Observable<Project> {
    return this.projectService.findMe(authorization);
  }

  @Mutation(() => Project)
  updateProject(
    @GqlHeaders('authorization') authorization: string,
    @Args() updateProjectArgs: UpdateProjectArgs,
  ): Observable<Project> {
    return this.projectService.updateMe(authorization, updateProjectArgs);
  }

  @Mutation(() => Project)
  removeProject(
    @GqlHeaders('authorization') authorization: string,
  ): Observable<Project> {
    return this.projectService.removeMe(authorization);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Boolean)
  inviteUser(
    @GqlHeaders('authorization') authorization: string,
    @Args() inviteUserArgs: InviteUserArgs,
  ): Observable<boolean> {
    return this.projectService.inviteUser(authorization, inviteUserArgs);
  }

  @Query(() => [User])
  projectUsers(
    @GqlHeaders('authorization') authorization: string,
  ): Observable<User[]> {
    return this.projectService.findAllUsers(authorization);
  }
}
