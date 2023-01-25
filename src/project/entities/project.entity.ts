import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProjectUser } from './project-user.entity';

@ObjectType()
export class Project {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  slug: string;

  @Field(() => [ProjectUser])
  users: ProjectUser[];

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
