import { Injectable, NotImplementedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateWebhookArgs } from './dto/create-webhook.args';
import { UpdateWebhookArgs } from './dto/update-webhook.args';
import { Webhook } from './entities/webhook.entity';

@Injectable()
export class WebhookService {
  create(
    projectId: number,
    createWebhookArgs: CreateWebhookArgs,
  ): Observable<Webhook> {
    throw new NotImplementedException();
  }

  findAll(projectId: number): Observable<Webhook[]> {
    throw new NotImplementedException();
  }

  findOne(projectId: number, id: number): Observable<Webhook> {
    throw new NotImplementedException();
  }

  update(
    projectId: number,
    updateWebhookArgs: UpdateWebhookArgs,
  ): Observable<Webhook> {
    throw new NotImplementedException();
  }

  remove(projectId: number, id: number): Observable<Webhook> {
    throw new NotImplementedException();
  }
}
