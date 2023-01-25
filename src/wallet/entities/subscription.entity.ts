import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SubscriptionEntity {
  @Field(() => String)
  expiresAt: string;
}
