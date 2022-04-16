import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhookResolver } from './webhook.resolver';
import { WebhookService } from './webhook.service';

@Module({
  imports: [ConfigModule],
  providers: [WebhookResolver, WebhookService],
})
export class WebhookModule {}
