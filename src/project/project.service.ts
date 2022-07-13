import {
  BadRequestException,
  Inject,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Token } from 'src/auth/entities/token.entity';
import { AUTH_SERVICE } from 'src/shared/rabbitmq/constants';
import { User } from 'src/user/entities/user.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { InviteInput } from './dto/invite.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { ProjectWithToken } from './entities/project-with-token.entity';
import { Project } from './entities/project.entity';
import { ProjectTokenService } from './project-token.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectTokenService: ProjectTokenService,
    @Inject(AUTH_SERVICE) private readonly client: ClientProxy,
  ) {}

  async create(
    user: any,
    input: CreateProjectInput,
  ): Promise<ProjectWithToken> {
    try {
      const project = await lastValueFrom(
        this.client.send<Project>('projects.create', {
          user,
          data: input,
        }),
      );

      return {
        ...project,
        token: await this.projectTokenService.save(
          project.id,
          await this.signIn(user, project.id),
        ),
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findMe(user: any): Promise<Project> {
    try {
      return await lastValueFrom(
        this.client.send<Project>('projects.@me', {
          user,
          data: {},
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async update(user: any, input: UpdateProjectInput): Promise<Project> {
    try {
      return await lastValueFrom(
        this.client.send<Project>('projects.update', {
          user,
          data: input,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(user: any): Promise<Project> {
    throw new NotImplementedException();
  }

  async signIn(user: any, id: number): Promise<Token> {
    try {
      return await lastValueFrom(
        this.client.send<Token>('projects.@me.token', {
          user,
          data: id,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async invite(user: any, input: InviteInput): Promise<boolean> {
    try {
      await lastValueFrom(
        this.client.send<Token>('projects.@me.users.invite', {
          user,
          data: input,
        }),
      );

      return true;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAllUsers(user: any, ...ids: number[]): Promise<User[]> {
    try {
      return await lastValueFrom(
        this.client.send<User[]>('projects.@me.users.findAll', {
          user,
          data: ids,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
