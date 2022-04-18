import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class TagWithoutParentAndChildren {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  color: string;
}

@ObjectType()
export class Tag extends TagWithoutParentAndChildren {
  @Field(() => TagWithoutParentAndChildren)
  parent: TagWithoutParentAndChildren;

  @Field(() => [TagWithoutParentAndChildren])
  children: TagWithoutParentAndChildren[];
}
