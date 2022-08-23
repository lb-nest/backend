import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CustomField {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  value: string | null;
}
