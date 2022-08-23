import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Attachment } from './attachment.entity';

@ObjectType()
export class Content {
  @Field(() => String, { nullable: true })
  text: string | null;

  @Field(() => [Attachment])
  attachments: Attachment[];

  @Field(() => [GraphQLJSON], { nullable: true })
  buttons: any[] | null;
}
