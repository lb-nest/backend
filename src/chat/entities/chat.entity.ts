import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Contact } from 'src/contact/entities/contact.entity';
import { Message } from 'src/message/entities/message.entity';

@ObjectType()
export class Chat {
  channelId: number;

  accountId: string;

  @Field(() => Contact)
  contact: Contact;

  @Field(() => [Message])
  messages: Message[];

  @Field(() => Int)
  unreadCount: number;
}
