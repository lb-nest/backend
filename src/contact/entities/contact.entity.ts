import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Tag, TagWithoutParentAndChildren } from 'src/tag/entities/tag.entity';
import { ContactStatus } from '../enums/contact-status.enum';

@ObjectType()
class ContactTag {
  @Field(() => TagWithoutParentAndChildren)
  tag: TagWithoutParentAndChildren;
}

@ObjectType()
export class Contact {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  username: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  avatarUrl: string;

  @Field(() => ContactStatus)
  status: ContactStatus;

  @Field(() => Int, { nullable: true })
  assignedTo?: number;

  @Field(() => String)
  notes: string;

  @Field(() => Int)
  priority: number;

  @Field(() => Boolean)
  resolved: boolean;

  @Field(() => [ContactTag])
  tags: ContactTag[];
}
