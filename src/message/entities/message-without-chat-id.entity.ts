import { ObjectType, OmitType } from '@nestjs/graphql';
import { Message } from './message.entity';

@ObjectType()
export class MessageWithoutChatId extends OmitType(Message, ['chat']) {}
