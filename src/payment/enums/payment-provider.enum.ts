import { registerEnumType } from '@nestjs/graphql';

export enum PaymentProvider {
  Yookassa = 'Yookassa',
}

registerEnumType(PaymentProvider, {
  name: 'PaymentProvider',
});
