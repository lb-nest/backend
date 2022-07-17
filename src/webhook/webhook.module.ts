import { Module } from '@nestjs/common';
import { WebhookResolver } from './webhook.resolver';
import { WebhookService } from './webhook.service';

@Module({
  providers: [WebhookResolver, WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
