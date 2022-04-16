import { ArgsType, PartialType } from '@nestjs/graphql';
import { CreateMessageInput } from './create-message.input';

@ArgsType()
export class UpdateMessageInput extends PartialType(CreateMessageInput) {}
