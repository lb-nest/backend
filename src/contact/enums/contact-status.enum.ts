import { registerEnumType } from '@nestjs/graphql';

export enum ContactStatus {
  Opened = 'Opened',
  Closed = 'Closed',
}

registerEnumType(ContactStatus, {
  name: 'ContactStatus',
});
