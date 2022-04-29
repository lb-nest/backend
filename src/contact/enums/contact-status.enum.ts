import { registerEnumType } from '@nestjs/graphql';

export enum ContactStatus {
  Open = 'Open',
  Closed = 'Closed',
}

registerEnumType(ContactStatus, {
  name: 'ContactStatus',
});
