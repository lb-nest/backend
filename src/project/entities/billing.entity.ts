import { Field, ObjectType } from '@nestjs/graphql';
import { BillingType } from '../enums/billing-type.enum';

@ObjectType()
export class Billing {
  @Field(() => BillingType)
  type: BillingType;
}
