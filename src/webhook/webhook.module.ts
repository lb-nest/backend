import { Module } from '@nestjs/common';
import { WebhookResolver } from './webhook.resolver';
import { WebhookService } from './webhook.service';

@Module({
  imports: [],
  providers: [WebhookResolver, WebhookService],
  exports: [WebhookResolver, WebhookService],
})
export class WebhookModule {}
