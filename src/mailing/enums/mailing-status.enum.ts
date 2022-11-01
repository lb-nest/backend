import { registerEnumType } from '@nestjs/graphql';

export enum MailingStatus {
  Disabled = 'Disabled',
  Scheduled = 'Scheduled',
  Active = 'Active',
  Finished = 'Finished',
}

registerEnumType(MailingStatus, {
  name: 'MailingStatus',
});
