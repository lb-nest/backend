import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ContactsCount {
  @Field(() => Int)
  assigned: number;

  @Field(() => Int)
  unassigned: number;
}
