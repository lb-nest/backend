import { registerEnumType } from '@nestjs/graphql';

export enum MailingWorkerStatus {
  Scheduled = 'Scheduled',
  Active = 'Active',
  Finished = 'Finished',
  Failed = 'Failed',
}

registerEnumType(MailingWorkerStatus, {
  name: 'MailingWorkerStatus',
});
