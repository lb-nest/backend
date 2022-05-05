import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateWebhookInput } from './dto/create-webhook.input';
import { UpdateWebhookInput } from './dto/update-webhook.input';
import { Webhook } from './entities/webhook.entity';

@Injectable()
export class WebhookService {
  private readonly messagingUrl: string;

  constructor(configService: ConfigService) {
    this.messagingUrl = configService.get<string>('MESSAGING_URL');
  }

  async create(
    authorization: string,
    input: CreateWebhookInput,
  ): Promise<Webhook> {
    try {
      const res = await axios.post<any>(
        this.messagingUrl.concat('/webhooks'),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.body);
    }
  }

  async findAll(authorization: string): Promise<Webhook[]> {
    try {
      const res = await axios.get<any[]>(
        this.messagingUrl.concat('/webhooks'),
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.body);
    }
  }

  async findOne(authorization: string, id: number): Promise<Webhook> {
    try {
      const res = await axios.get<any>(
        this.messagingUrl.concat(`/webhooks/${id}`),
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.body);
    }
  }

  async update(
    authorization: string,
    input: UpdateWebhookInput,
  ): Promise<Webhook> {
    try {
      const res = await axios.patch<any>(
        this.messagingUrl.concat(`/webhooks/${input.id}`),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.body);
    }
  }

  async remove(authorization: string, id: number): Promise<Webhook> {
    try {
      const res = await axios.delete<any>(
        this.messagingUrl.concat(`/webhooks/${id}`),
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.body);
    }
  }
}
