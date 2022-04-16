import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Webhook {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  url: string;

  @Field(() => String)
  type: string;
}
