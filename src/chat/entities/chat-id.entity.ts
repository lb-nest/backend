import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChatId {
  @Field(() => Int)
  id: number;
}
