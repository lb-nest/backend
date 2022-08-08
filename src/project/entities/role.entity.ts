import { Field, ObjectType } from '@nestjs/graphql';
import { RoleType } from '../enums/role-type.enum';

@ObjectType()
export class Role {
  @Field(() => RoleType)
  role: RoleType;
}
