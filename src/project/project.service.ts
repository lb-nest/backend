import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateProjectInput } from './dto/create-project.input';
import { InviteInput } from './dto/invite.input';
import { UpdateProjectInput } from './dto/update-project.input';

@Injectable()
export class ProjectService {
  constructor(private readonly configService: ConfigService) {}

  async create(authorization: string, input: CreateProjectInput) {
    const url = this.configService.get<string>('AUTH_URL');

    try {
      const res = await axios.post(url.concat('/projects'), input, {
        headers: {
          authorization,
        },
      });

      await this.createWebhooks(authorization, res.data.id);
      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async signIn(authorization: string, id: number) {
    const url = this.configService.get<string>('AUTH_URL');

    try {
      const res = await axios.post(
        url.concat(`/auth/projects/${id}/token`),
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
    const url = this.configService.get<string>('AUTH_URL');

    try {
      const res = await axios.get(url.concat('/projects/@me'), {
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
    const url = this.configService.get<string>('AUTH_URL');

    try {
      await axios.post(url.concat('/projects/@me/invites'), input, {
        headers: {
          authorization,
        },
      });

      return true;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async update(authorization: string, input: UpdateProjectInput) {
    const url = this.configService.get<string>('AUTH_URL');

    try {
      const res = await axios.patch(url.concat('/projects/@me'), input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async remove(authorization: string) {
    const url = this.configService.get<string>('AUTH_URL');

    try {
      const res = await axios.delete(url.concat('/projects/@me'), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
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
        axios.post(url.concat('/webhooks'), webhook, {
          headers: {
            authorization: 'Bearer '.concat(res.token),
          },
        }),
      ),
    );
  }
}
