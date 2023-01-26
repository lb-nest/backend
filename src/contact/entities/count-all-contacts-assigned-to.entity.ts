import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CountAllContactsAssignedTo {
  @Field(() => Int)
  assigned: number;

  @Field(() => Int)
  unassigned: number;
}
