import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessagingQuota {
  @Field(() => Int)
  channelId: number;

  @Field(() => Int)
  value: number;

  @Field(() => Int)
  year: number;

  @Field(() => Int)
  month: number;
}
