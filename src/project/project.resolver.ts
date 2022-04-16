import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Token } from 'src/auth/entities/token.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => Project)
  createProject(@Context() context: any, @Args() input: CreateProjectInput) {
    return this.projectService.create(context.req.headers.authorization, input);
  }

  @Mutation(() => Token)
  signInProject(
    @Context() context: any,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.projectService.signIn(context.req.headers.authorization, id);
  }

  @Query(() => Project)
  project(@Context() context: any) {
    return this.projectService.getByToken(context.req.headers.authorization);
  }

  @Mutation(() => Project)
  updateProject(@Context() context: any, @Args() input: UpdateProjectInput) {
    return this.projectService.update(context.req.headers.authorization, input);
  }

  @Mutation(() => Project)
  removeProject(@Context() context: any) {
    return this.projectService.remove(context.req.headers.authorization);
  }
}
