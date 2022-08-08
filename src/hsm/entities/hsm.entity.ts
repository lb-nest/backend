import { Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Approval } from './approval.entity';

@ObjectType()
export class Hsm {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  code: string;

  @Field(() => String)
  text: string;

  @Field(() => [GraphQLJSON], { nullable: true })
  attachments: any[] | null;

  @Field(() => [GraphQLJSON], { nullable: true })
  buttons: any[] | null;

  @Field(() => [Approval])
  approval: Approval[];
}
