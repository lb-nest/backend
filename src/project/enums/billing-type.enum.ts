import { registerEnumType } from '@nestjs/graphql';

export enum BillingType {
  Free = 'Free',
  Paid = 'Paid',
}

registerEnumType(BillingType, {
  name: 'BillingType',
});
