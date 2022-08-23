import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MessageStatus } from '../enums/message-status.enum';
import { ChatId } from '../../chat/entities/chat-id.entity';
import { Content } from './content.entity';

@ObjectType()
export class Message {
  @Field(() => Int)
  id: number;

  @Field(() => Boolean)
  fromMe: boolean;

  @Field(() => MessageStatus)
  status: MessageStatus;

  @Field(() => ChatId)
  chat: ChatId;

  @Field(() => [Content])
  content: Content[];

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
