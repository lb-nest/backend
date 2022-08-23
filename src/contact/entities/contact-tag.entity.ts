import { Field, ObjectType } from '@nestjs/graphql';
import { TagWithoutParentAndChildren } from 'src/tag/entities/tag-without-parent-and-children.entity';

@ObjectType()
export class ContactTag {
  @Field(() => TagWithoutParentAndChildren)
  tag: TagWithoutParentAndChildren;
}
