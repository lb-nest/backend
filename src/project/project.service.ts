import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { decode, JwtPayload } from 'jsonwebtoken';
import { Token } from 'src/auth/entities/token.entity';
import { User } from 'src/user/entities/user.entity';
import { WebhookEventType } from 'src/webhook/enums/webhook-event-type.enum';
import { CreateProjectInput } from './dto/create-project.input';
import { InviteInput } from './dto/invite.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { ProjectWithToken } from './entities/project-with-token.entity';
import { Project } from './entities/project.entity';
import { ProjectTokenService } from './project-token.service';

@Injectable()
export class ProjectService {
  private readonly axios: AxiosInstance;

  constructor(
    private readonly projectTokenService: ProjectTokenService,
    private readonly configService: ConfigService,
  ) {
    this.axios = axios.create({
      baseURL: configService.get<string>('AUTHORIZATION_URL'),
    });
  }

  async create(
    authorization: string,
    input: CreateProjectInput,
  ): Promise<ProjectWithToken> {
    try {
      const res = await this.axios.post<Project>('/projects', input, {
        headers: {
          authorization,
        },
      });

      const token = await this.signIn(authorization, res.data.id);

      await this.createWebhooks(authorization, res.data.id);

      const rootToken = this.configService.get<string>('ROOT_TOKEN');
      const root = <JwtPayload>decode(rootToken);
      await this.invite('Bearer '.concat(token.token), {
        email: root.email,
      });

      await this.projectTokenService.save(
        res.data.id,
        await this.signIn('Bearer '.concat(rootToken), res.data.id),
      );

      return {
        ...res.data,
        token,
      };
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async getMe(authorization: string): Promise<Project> {
    try {
      const res = await this.axios.get<Project>('/projects/@me', {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async update(
    authorization: string,
    input: UpdateProjectInput,
  ): Promise<Project> {
    try {
      const res = await this.axios.patch<Project>('/projects/@me', input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async remove(authorization: string): Promise<Project> {
    throw new NotImplementedException();
  }

  async signIn(authorization: string, id: number): Promise<Token> {
    try {
      const res = await this.axios.get<Token>(`/projects/${id}/token`, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async invite(authorization: string, input: InviteInput): Promise<boolean> {
    try {
      await this.axios.post<any>('/projects/@me/users', input, {
        headers: {
          authorization,
        },
      });

      return true;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async getUsers(authorization: string, ...ids: number[]): Promise<User[]> {
    const query = new URLSearchParams();
    if (ids.length) {
      query.set('ids', ids.join(','));
    }

    const res = await this.axios.get<any[]>(`/projects/@me/users?${query}`, {
      headers: {
        authorization,
      },
    });

    return res.data;
  }

  private async createWebhooks(authorization: string, id: number) {
    const backend = this.configService.get<string>('BACKEND_URL');
    const messaging = this.configService.get<string>('MESSAGING_URL');

    const webhooks = [
      {
        name: 'system.backend',
        url: backend.concat(`/projects/${id}/webhook`),
        eventType: WebhookEventType.All,
      },
    ];

    const token = await this.signIn(authorization, id);
    await Promise.all(
      webhooks.map((webhook) =>
        axios.post<any>(messaging.concat('/webhooks'), webhook, {
          headers: {
            authorization: 'Bearer '.concat(token.token),
          },
        }),
      ),
    );
  }
}
