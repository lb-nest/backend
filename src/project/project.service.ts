import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { Token } from 'src/auth/entities/token.entity';
import { AUTH_SERVICE } from 'src/shared/constants/broker';
import { User } from 'src/user/entities/user.entity';
import { CreateProjectArgs } from './dto/create-project.args';
import { InviteUserArgs } from './dto/invite-user.args';
import { UpdateProjectArgs } from './dto/update-project.args';
import { ProjectWithToken } from './entities/project-with-token.entity';
import { Project } from './entities/project.entity';
import { ProjectTokenService } from './project-token.service';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly client: ClientProxy,
    private readonly projectTokenService: ProjectTokenService,
  ) {}

  async create(
    authorization: string,
    createProjectArgs: CreateProjectArgs,
  ): Promise<ProjectWithToken> {
    const project = await lastValueFrom(
      this.client.send<Project>('projects.create', {
        headers: {
          authorization,
        },
        payload: createProjectArgs,
      }),
    );

    return {
      ...project,
      token: await this.projectTokenService.save(
        project.id,
        await lastValueFrom(this.signIn(authorization, project.id)),
      ),
    };
  }

  signIn(authorization: string, id: number): Observable<Token> {
    return this.client.send<Token>('projects.createToken', {
      headers: {
        authorization,
      },
      payload: id,
    });
  }

  findMe(authorization: string): Observable<Project> {
    return this.client.send<Project>('projects.@me', {
      headers: {
        authorization,
      },
      payload: null,
    });
  }

  updateMe(
    authorization: string,
    updateProjectArgs: UpdateProjectArgs,
  ): Observable<Project> {
    return this.client.send<Project>('projects.@me.update', {
      headers: {
        authorization,
      },
      payload: updateProjectArgs,
    });
  }

  removeMe(authorization: string): Observable<Project> {
    return this.client.send<Project>('projects.@me.remove', {
      headers: {
        authorization,
      },
      payload: null,
    });
  }

  inviteUser(
    authorization: string,
    inviteUserArgs: InviteUserArgs,
  ): Observable<boolean> {
    return this.client.send<boolean>('projects.@me.inviteUser', {
      headers: {
        authorization,
      },
      payload: inviteUserArgs,
    });
  }

  findAllUsers(authorization: string, ...ids: number[]): Observable<User[]> {
    return this.client.send<User[]>('projects.@me.findAllUsers', {
      headers: {
        authorization,
      },
      payload: ids,
    });
  }
}
