import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/user/entities/user.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { InviteInput } from './dto/invite.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/project.entity';
import { ProjectTokenService } from './project-token.service';

@Injectable()
export class ProjectService {
  private readonly url: string;

  constructor(
    private readonly projectTokenService: ProjectTokenService,
    private readonly configService: ConfigService,
  ) {
    this.url = configService.get<string>('AUTH_URL');
  }

  async create(
    authorization: string,
    input: CreateProjectInput,
  ): Promise<Project> {
    try {
      const res = await axios.post<any>(this.url.concat('/projects'), input, {
        headers: {
          authorization,
        },
      });

      const token = await this.signIn(authorization, res.data.id);

      await this.createWebhooks(authorization, res.data.id);

      const rootToken = this.configService.get<string>('ROOT_TOKEN');
      const root: any = jwt.decode(rootToken);
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
      const res = await axios.get<any>(this.url.concat('/projects/@me'), {
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
      const res = await axios.patch<any>(
        this.url.concat('/projects/@me'),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async remove(authorization: string): Promise<Project> {
    throw new NotImplementedException();
  }

  async signIn(authorization: string, id: number): Promise<any> {
    try {
      const res = await axios.post<any>(
        this.url.concat(`/auth/projects/${id}/token`),
        undefined,
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async invite(authorization: string, input: InviteInput): Promise<boolean> {
    try {
      await axios.post<any>(this.url.concat('/projects/@me/invites'), input, {
        headers: {
          authorization,
        },
      });

      return true;
    } catch (e) {
      console.log(authorization);

      throw new BadRequestException(e.response.data);
    }
  }

  async getUsers(authorization: string, ids?: string): Promise<User[]> {
    const query = new URLSearchParams();
    if (ids) {
      query.set('ids', ids);
    }

    const url = this.url.concat(`/projects/@me/users?${query}`);
    const res = await axios.get<any[]>(url, {
      headers: {
        authorization,
      },
    });

    return res.data;
  }

  private async createWebhooks(authorization: string, id: number) {
    const res = await this.signIn(authorization, id);

    const url = this.configService.get<string>('MESSAGING_URL');

    const path = `/projects/${id}/events`;
    const webhooks = [
      {
        name: 'system.backend',
        url: this.configService.get<string>('BACKEND_URL').concat(path),
        eventType: 'All',
      },
    ];

    await Promise.all(
      webhooks.map(async (webhook) =>
        axios.post<any>(url.concat('/webhooks'), webhook, {
          headers: {
            authorization: 'Bearer '.concat(res.token),
          },
        }),
      ),
    );
  }
}
