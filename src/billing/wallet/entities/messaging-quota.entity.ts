import { Field, Int } from '@nestjs/graphql';

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
