import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BillingType } from '../enums/billing-type.enum';
import { RoleType } from '../enums/role-type.enum';

@ObjectType()
class Billing {
  @Field(() => BillingType)
  type: BillingType;
}

@ObjectType()
class Role {
  @Field(() => RoleType)
  role: RoleType;
}

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
  roles: Role[];

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
