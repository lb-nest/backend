import { registerEnumType } from '@nestjs/graphql';

export enum TransactionType {
  BIC = 'BIC',
  UIC = 'UIC',
}

registerEnumType(TransactionType, {
  name: 'TransactionType',
});
