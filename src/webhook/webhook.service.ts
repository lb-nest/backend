import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { CreateWebhookInput } from './dto/create-webhook.input';
import { UpdateWebhookInput } from './dto/update-webhook.input';
import { Webhook } from './entities/webhook.entity';

@Injectable()
export class WebhookService {
  private readonly axios: AxiosInstance;

  constructor(configService: ConfigService) {
    this.axios = axios.create({
      baseURL: configService.get<string>('MESSAGING_URL'),
    });
  }

  async create(
    authorization: string,
    input: CreateWebhookInput,
  ): Promise<Webhook> {
    try {
      const res = await this.axios.post<Webhook>('/webhooks', input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response?.body);
    }
  }

  async findAll(authorization: string): Promise<Webhook[]> {
    try {
      const res = await this.axios.get<Webhook[]>('/webhooks', {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response?.body);
    }
  }

  async findOne(authorization: string, id: number): Promise<Webhook> {
    try {
      const res = await this.axios.get<Webhook>(`/webhooks/${id}`, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response?.body);
    }
  }

  async update(
    authorization: string,
    input: UpdateWebhookInput,
  ): Promise<Webhook> {
    try {
      const res = await this.axios.patch<Webhook>(
        `/webhooks/${input.id}`,
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response?.body);
    }
  }

  async remove(authorization: string, id: number): Promise<Webhook> {
    try {
      const res = await this.axios.delete<Webhook>(`/webhooks/${id}`, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response?.body);
    }
  }
}
