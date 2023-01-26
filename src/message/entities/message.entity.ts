import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MessageStatus } from '../enums/message-status.enum';
import { Content } from './content.entity';

@ObjectType()
export class Message {
  @Field(() => Int)
  id: number;

  @Field(() => Boolean)
  fromMe: boolean;

  @Field(() => MessageStatus)
  status: MessageStatus;

  @Field(() => [Content])
  content: Content[];

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
