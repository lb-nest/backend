import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MesagingQuota {
  @Field(() => Int)
  channelId: number;
}
