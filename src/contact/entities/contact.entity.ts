import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TagWithoutParentAndChildren } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
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

  @Field(() => User, { nullable: true })
  assignedTo?: User;

  @Field(() => String)
  notes: string;

  @Field(() => Int)
  priority: number;

  @Field(() => Boolean)
  resolved: boolean;

  @Field(() => [ContactTag])
  tags: ContactTag[];
}
