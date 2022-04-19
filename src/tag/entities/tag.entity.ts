import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TagWithoutParentAndChildren {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  color: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}

@ObjectType()
export class Tag extends TagWithoutParentAndChildren {
  @Field(() => TagWithoutParentAndChildren, { nullable: true })
  parent: TagWithoutParentAndChildren;

  @Field(() => [TagWithoutParentAndChildren])
  children: TagWithoutParentAndChildren[];
}
