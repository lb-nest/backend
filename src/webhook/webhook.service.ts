import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateWebhookInput } from './dto/create-webhook.input';
import { UpdateWebhookInput } from './dto/update-webhook.input';

@Injectable()
export class WebhookService {
  constructor(private readonly configService: ConfigService) {}

  async create(authorization: string, input: CreateWebhookInput) {
    const url = this.configService.get<string>('MESSAGING_URL');

    try {
      const res = await axios.post(url.concat('/webhooks'), input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.body);
    }
  }

  async findAll(authorization: string) {
    const url = this.configService.get<string>('MESSAGING_URL');

    try {
      const res = await axios.get(url.concat('/webhooks'), {
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
    const url = this.configService.get<string>('MESSAGING_URL');

    try {
      const res = await axios.get(url.concat(`/webhooks/${id}`), {
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
    const url = this.configService.get<string>('MESSAGING_URL');

    try {
      const res = await axios.patch(url.concat('/webhooks'), input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.body);
    }
  }

  async remove(authorization: string, id: number) {
    const url = this.configService.get<string>('MESSAGING_URL');

    try {
      const res = await axios.delete(url.concat(`/webhooks/${id}`), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.body);
    }
  }
}
