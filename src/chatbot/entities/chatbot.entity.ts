import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Chatbot {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  version: string;

  @Field(() => Boolean)
  enabled: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
