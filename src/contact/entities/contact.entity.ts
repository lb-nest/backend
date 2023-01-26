import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { AssigneeType } from '../enums/assignee-type.enum';
import { ContactStatus } from '../enums/contact-status.enum';
import { ContactTag } from './contact-tag.entity';
import { CustomField } from './custom-field.entity';

@ObjectType()
export class Contact {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  avatarUrl: string | null;

  @Field(() => String)
  notes: string;

  @Field(() => [ContactTag])
  tags: ContactTag[];

  @Field(() => ContactStatus)
  status: ContactStatus;

  @Field(() => User, { nullable: true })
  assignedTo:
    | (User & {
        type?: AssigneeType;
      })
    | null;

  chats: Array<{
    channelId: number;
    accountId: string;
  }>;

  @Field(() => Int)
  priority: number;

  @Field(() => Boolean)
  resolved: boolean;

  @Field(() => [CustomField])
  customFields: CustomField[];
}
