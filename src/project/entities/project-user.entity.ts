import { Field, ObjectType } from '@nestjs/graphql';
import { AccessLevel } from '../enums/access-level.enum';

@ObjectType()
export class ProjectUser {
  @Field(() => AccessLevel)
  accessLevel: AccessLevel;
}
