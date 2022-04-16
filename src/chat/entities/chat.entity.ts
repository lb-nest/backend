import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Chat {
  @Field(() => Int)
  id: number;
}
