import { Field, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { Contact } from 'src/contact/entities/contact.entity';
import { Message } from 'src/message/entities/message.entity';

@ObjectType()
class MessageWithoutChatId extends OmitType(Message, ['chat']) {}

@ObjectType()
export class Chat {
  @Field(() => Int)
  id: number;

  @Field(() => Contact)
  contact: Contact;

  @Field(() => [MessageWithoutChatId])
  messages: MessageWithoutChatId[];
}
