import { registerEnumType } from '@nestjs/graphql';

export enum WebhookEventType {
  IncomingChats = 'IncomingChats',
  OutgoingChats = 'OutgoingChats',
  IncomingMessages = 'IncomingMessages',
  OutgoingMessages = 'OutgoingMessages',
  All = 'All',
}

registerEnumType(WebhookEventType, {
  name: 'WebhookEventType',
});
