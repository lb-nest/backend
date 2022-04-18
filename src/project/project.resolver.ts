import { Headers } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Token } from 'src/auth/entities/token.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => Project)
  createProject(
    @Headers('authorization') authorization: string,
    @Args() input: CreateProjectInput,
  ) {
    return this.projectService.create(authorization, input);
  }

  @Mutation(() => Token)
  signInProject(
    @Headers('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.projectService.signIn(authorization, id);
  }

  @Query(() => Project)
  project(@Headers('authorization') authorization: string) {
    return this.projectService.getByToken(authorization);
  }

  @Mutation(() => Project)
  updateProject(
    @Headers('authorization') authorization: string,
    @Args() input: UpdateProjectInput,
  ) {
    return this.projectService.update(authorization, input);
  }

  @Mutation(() => Project)
  removeProject(@Headers('authorization') authorization: string) {
    return this.projectService.remove(authorization);
  }
}
