import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateWebhookInput } from './dto/create-webhook.input';
import { UpdateWebhookInput } from './dto/update-webhook.input';
import { Webhook } from './entities/webhook.entity';

@Injectable()
export class WebhookService {
  async create(user: any, input: CreateWebhookInput): Promise<Webhook> {
    throw new NotImplementedException();
  }

  async findAll(user: any): Promise<Webhook[]> {
    throw new NotImplementedException();
  }

  async findOne(user: any, id: number): Promise<Webhook> {
    throw new NotImplementedException();
  }

  async update(user: any, input: UpdateWebhookInput): Promise<Webhook> {
    throw new NotImplementedException();
  }

  async remove(user: any, id: number): Promise<Webhook> {
    throw new NotImplementedException();
  }
}
