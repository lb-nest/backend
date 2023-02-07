import { Field, ObjectType } from '@nestjs/graphql';
import { TransactionType } from '../enums/transaction-type.enum';

@ObjectType()
export class Transaction {
  @Field(() => String)
  id: string;

  @Field(() => TransactionType)
  type: TransactionType;

  @Field(() => Number)
  bill: number;

  @Field(() => Boolean)
  billable: boolean;

  @Field(() => String)
  createdAt: string;
}
