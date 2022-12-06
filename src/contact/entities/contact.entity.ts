import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ChatId } from 'src/chat/entities/chat-id.entity';
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

  @Field(() => ContactStatus)
  status: ContactStatus;

  @Field(() => String, { nullable: true })
  telegramId: string | null;

  @Field(() => String, { nullable: true })
  whatsappId: string | null;

  @Field(() => String, { nullable: true })
  webchatId: string | null;

  @Field(() => User, { nullable: true })
  assignedTo:
    | (User & {
        type?: AssigneeType;
      })
    | null;

  @Field(() => Int)
  priority: number;

  @Field(() => Boolean)
  resolved: boolean;

  @Field(() => [CustomField])
  customFields: CustomField[];

  @Field(() => [ChatId])
  chats: ChatId[];

  @Field(() => [ContactTag])
  tags: ContactTag[];
}
