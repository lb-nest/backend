import { registerEnumType } from '@nestjs/graphql';

export enum WebhookEventType {
  All = 'All',
}

registerEnumType(WebhookEventType, {
  name: 'WebhookEventType',
});
