import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { Token } from 'src/auth/entities/token.entity';
import { AUTH_SERVICE } from 'src/shared/constants/broker';
import { User } from 'src/user/entities/user.entity';
import { WalletService } from 'src/wallet/wallet.service';
import { CreateProjectArgs } from './dto/create-project.args';
import { InviteUserArgs } from './dto/invite-user.args';
import { UpdateProjectArgs } from './dto/update-project.args';
import { ProjectWithToken } from './entities/project-with-token.entity';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly client: ClientProxy,
    private readonly walletService: WalletService,
  ) {}

  async create(
    userId: number,
    createProjectArgs: CreateProjectArgs,
  ): Promise<ProjectWithToken> {
    const project = await lastValueFrom(
      this.client.send<Project>('createProject', {
        userId,
        ...createProjectArgs,
      }),
    );

    await Promise.allSettled([
      lastValueFrom(
        this.walletService.create(project.id, {
          country: 'RU',
          currency: 'RUB',
        }),
      ),
    ]);

    return {
      ...project,
      token: await lastValueFrom(this.createToken(userId, project.id)),
    };
  }

  findAll(): Observable<Project[]> {
    return this.client.send<Project[]>('findAllProjects', undefined);
  }

  findOne(userId: number, id: number): Observable<Project> {
    return this.client.send<Project>('findOneProject', {
      userId,
      id,
    });
  }

  update(
    userId: number,
    id: number,
    updateProjectArgs: UpdateProjectArgs,
  ): Observable<Project> {
    return this.client.send<Project>('updateProject', {
      userId,
      id,
      ...updateProjectArgs,
    });
  }

  remove(userId: number, id: number): Observable<Project> {
    return this.client.send<Project>('removeProject', {
      userId,
      id,
    });
  }

  createToken(userId: number, id: number): Observable<Token> {
    return this.client.send<Token>('createProjectToken', {
      userId,
      id,
    });
  }

  createUser(
    projectId: number,
    inviteUserArgs: InviteUserArgs,
  ): Observable<boolean> {
    return this.client.send<boolean>('createProjectUser', {
      projectId,
      ...inviteUserArgs,
    });
  }

  findAllUsers(projectId: number, ...ids: number[]): Observable<User[]> {
    return this.client.send<User[]>('findAllProjectUsers', {
      projectId,
      ids: ids.length > 0 ? ids : undefined,
    });
  }
}
