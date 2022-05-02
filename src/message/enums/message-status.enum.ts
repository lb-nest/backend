import { registerEnumType } from '@nestjs/graphql';

export enum MessageStatus {
  Accepted = 'Accepted',
  Delivered = 'Delivered',
  Read = 'Read',
  Error = 'Error',
}

registerEnumType(MessageStatus, {
  name: 'MessageStatus',
});
