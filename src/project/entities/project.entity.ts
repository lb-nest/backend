import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BillingType } from '../enums/billing-type.enum';

@ObjectType()
class Billing {
  @Field(() => BillingType)
  type: BillingType;
}

@ObjectType()
class Role {
  @Field(() => String)
  role: string;
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
