import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BearerAuth } from 'src/auth/decorators/bearer-auth.decorator';
import { BearerAuthGuard } from 'src/auth/guargs/bearer-auth.guard';
import { Token } from 'src/auth/entities/token.entity';
import { Auth } from 'src/auth/interfaces/auth.interface';
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

  @UseGuards(BearerAuthGuard)
  @Mutation(() => ProjectWithToken)
  createProject(
    @BearerAuth() auth: Auth,
    @Args() createProjectArgs: CreateProjectArgs,
  ): Promise<ProjectWithToken> {
    return this.projectService.create(auth.id, createProjectArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Project)
  project(@BearerAuth() auth: Required<Auth>): Observable<Project> {
    return this.projectService.findOne(auth.id, auth.project.id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Project)
  updateProject(
    @BearerAuth() auth: Required<Auth>,
    @Args() updateProjectArgs: UpdateProjectArgs,
  ): Observable<Project> {
    return this.projectService.update(
      auth.id,
      auth.project.id,
      updateProjectArgs,
    );
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Project)
  removeProject(@BearerAuth() auth: Required<Auth>): Observable<Project> {
    return this.projectService.remove(auth.id, auth.project.id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Token)
  signInProject(
    @BearerAuth() auth: Auth,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Token> {
    return this.projectService.createToken(auth.id, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Boolean)
  inviteUser(
    @BearerAuth() auth: Required<Auth>,
    @Args() inviteUserArgs: InviteUserArgs,
  ): Observable<boolean> {
    return this.projectService.createUser(auth.project.id, inviteUserArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [User])
  projectUsers(@BearerAuth() auth: Required<Auth>): Observable<User[]> {
    return this.projectService.findAllUsers(auth.project.id);
  }
}
