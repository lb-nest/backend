import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Role {
  @Field(() => String)
  role: string;
}
