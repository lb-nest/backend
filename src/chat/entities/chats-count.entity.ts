import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChatsCount {
  @Field(() => Int)
  assigned: number;

  @Field(() => Int)
  unassigned: number;
}
