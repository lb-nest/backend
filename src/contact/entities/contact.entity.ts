import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Contact {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  username: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  avatarUrl: string;
}
