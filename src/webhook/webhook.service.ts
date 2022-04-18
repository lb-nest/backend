import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateWebhookInput } from './dto/create-webhook.input';
import { UpdateWebhookInput } from './dto/update-webhook.input';

@Injectable()
export class WebhookService {
  private readonly messagingUrl: string;

  constructor(configService: ConfigService) {
    this.messagingUrl = configService.get<string>('MESSAGING_URL');
  }

  async create(authorization: string, input: CreateWebhookInput) {
    try {
      const res = await axios.post(
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

  async findAll(authorization: string) {
    try {
      const res = await axios.get(this.messagingUrl.concat('/webhooks'), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.body);
    }
  }

  async findOne(authorization: string, id: number) {
    try {
      const res = await axios.get(this.messagingUrl.concat(`/webhooks/${id}`), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.body);
    }
  }

  async update(authorization: string, input: UpdateWebhookInput) {
    try {
      const res = await axios.patch(
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

  async remove(authorization: string, id: number) {
    try {
      const res = await axios.delete(
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
