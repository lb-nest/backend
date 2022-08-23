import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  avatarUrl: string | null;

  @Field(() => String)
  email: string;

  @Field(() => Boolean)
  confirmed: boolean;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
