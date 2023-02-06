import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { PaymentStatus } from '../enums/payment-status.enum';

@ObjectType()
export class Payment {
  @Field(() => String)
  id: string;

  @Field(() => PaymentStatus)
  status: PaymentStatus;

  @Field(() => String)
  amount: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  payload?: any;
}
