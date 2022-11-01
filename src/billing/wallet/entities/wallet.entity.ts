import { Field, Float, ObjectType } from '@nestjs/graphql';
import { MessagingQuota } from './messaging-quota.entity';

@ObjectType()
export class Wallet {
  @Field(() => String)
  country: string;

  @Field(() => String)
  currency: string;

  @Field(() => Float)
  currentBalance: number;

  @Field(() => [MessagingQuota])
  messagingQuota: MessagingQuota[];
}
