import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/auth/auth.decorator';
import { Token } from 'src/auth/entities/token.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { InviteInput } from './dto/invite.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { ProjectWithToken } from './entities/project-with-token.entity';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => ProjectWithToken)
  createProject(
    @Auth() authorization: string,
    @Args() input: CreateProjectInput,
  ) {
    return this.projectService.create(authorization, input);
  }

  @Mutation(() => Token)
  signInProject(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.projectService.signIn(authorization, id);
  }

  @Query(() => Project)
  project(@Auth() authorization: string) {
    return this.projectService.getMe(authorization);
  }

  @Mutation(() => Project)
  updateProject(
    @Auth() authorization: string,
    @Args() input: UpdateProjectInput,
  ) {
    return this.projectService.update(authorization, input);
  }

  @Mutation(() => Project)
  removeProject(@Auth() authorization: string) {
    return this.projectService.remove(authorization);
  }

  @Mutation(() => Boolean)
  invite(@Auth() authorization: string, @Args() input: InviteInput) {
    return this.projectService.invite(authorization, input);
  }

  @Query(() => [User])
  projectUsers(@Auth() authorization: string) {
    return this.projectService.getUsers(authorization);
  }
}
