import { Field, ObjectType } from '@nestjs/graphql';
import { MesagingQuota } from './messaging-quota.entity';

@ObjectType()
export class Wallet {
  @Field(() => String)
  country: string;

  @Field(() => String)
  currency: string;

  @Field(() => Number)
  currentBalance: number;

  @Field(() => [MesagingQuota])
  messagingQuota: MesagingQuota[];
}
