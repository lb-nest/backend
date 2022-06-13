import { Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class Chatbot {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  version: string;

  @Field(() => GraphQLJSON)
  flow: any;

  @Field(() => Boolean)
  enabled: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
