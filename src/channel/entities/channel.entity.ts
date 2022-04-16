import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Channel {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  type: string;

  @Field(() => String)
  status: string;
}
