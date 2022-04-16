import { InputType, PartialType } from '@nestjs/graphql';
import { CreateChatInput } from './create-chat.input';

@InputType()
export class UpdateChatInput extends PartialType(CreateChatInput) {}
