import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Billing {
  @Field(() => String)
  type: string;
}
