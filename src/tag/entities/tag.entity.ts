import { Field, ObjectType } from '@nestjs/graphql';
import { TagWithoutParentAndChildren } from './tag-without-parent-and-children.entity';

@ObjectType()
export class Tag extends TagWithoutParentAndChildren {
  @Field(() => TagWithoutParentAndChildren, { nullable: true })
  parent?: TagWithoutParentAndChildren;

  @Field(() => [TagWithoutParentAndChildren])
  children: TagWithoutParentAndChildren[];
}
