import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Contact } from 'src/contact/entities/contact.entity';
import { MessageWithoutChatId } from 'src/message/entities/message-without-chat-id.entity';
import { ChatId } from './chat-id.entity';

@ObjectType()
export class Chat extends ChatId {
  @Field(() => Contact)
  contact: Contact;

  @Field(() => [MessageWithoutChatId])
  messages: MessageWithoutChatId[];

  @Field(() => Int)
  unreadCount: number;
}
