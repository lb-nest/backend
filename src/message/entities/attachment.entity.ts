import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Attachment {
  @Field(() => String)
  type: string;

  @Field(() => String)
  url: string;

  @Field(() => String, { nullable: true })
  name: string | null;
}
