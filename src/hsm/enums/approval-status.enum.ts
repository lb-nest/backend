import { registerEnumType } from '@nestjs/graphql';

export enum ApprovalStatus {
  Requested = 'Requested',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

registerEnumType(ApprovalStatus, {
  name: 'ApprovalStatus',
});
