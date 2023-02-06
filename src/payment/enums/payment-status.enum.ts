import { registerEnumType } from '@nestjs/graphql';

export enum PaymentStatus {
  Pending = 'Pending',
  Succeeded = 'Succeeded',
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});
