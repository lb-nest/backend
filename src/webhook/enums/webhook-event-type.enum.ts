import { registerEnumType } from '@nestjs/graphql';

export enum WebhookEventType {
  NewChats = 'NewChats',
  IncomingMessages = 'IncomingMessages',
  OutgoingMessages = 'OutgoingMessages',
  All = 'All',
}

registerEnumType(WebhookEventType, {
  name: 'WebhookEventType',
});
