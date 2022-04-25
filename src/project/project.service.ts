import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateProjectInput } from './dto/create-project.input';
import { InviteInput } from './dto/invite.input';
import { UpdateProjectInput } from './dto/update-project.input';

@Injectable()
export class ProjectService {
  private readonly authUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.authUrl = configService.get<string>('AUTH_URL');
  }

  async create(authorization: string, input: CreateProjectInput) {
    try {
      const res = await axios.post<any>(
        this.authUrl.concat('/projects'),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      await this.createWebhooks(authorization, res.data.id);
      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async signIn(authorization: string, id: number) {
    try {
      const res = await axios.post<any>(
        this.authUrl.concat(`/auth/projects/${id}/token`),
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

  async getByToken(authorization: string) {
    try {
      const res = await axios.get<any>(this.authUrl.concat('/projects/@me'), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async invite(authorization: string, input: InviteInput) {
    try {
      await axios.post<any>(
        this.authUrl.concat('/projects/@me/invites'),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      return true;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async getUsers(authorization: string, ids?: string) {
    const url = this.authUrl.concat(
      '/projects/@me/users',
      ids ? `?ids=${ids}` : '',
    );

    const res = await axios.get<any[]>(url, {
      headers: {
        authorization,
      },
    });

    return res.data;
  }

  async update(authorization: string, input: UpdateProjectInput) {
    try {
      const res = await axios.patch<any>(
        this.authUrl.concat('/projects/@me'),
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

  async remove(authorization: string) {
    throw new NotImplementedException();
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
