import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Billing } from './billing.entity';
import { Role } from './role.entity';

@ObjectType()
export class Project {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  slug: string;

  @Field(() => Billing)
  billing: Billing;

  @Field(() => [Role])
  roles: Role;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
