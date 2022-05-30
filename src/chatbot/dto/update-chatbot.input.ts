import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateChatbotInput } from './create-chatbot.input';

@ArgsType()
export class UpdateChatbotInput extends PartialType(CreateChatbotInput) {
  @Field(() => Int)
  id: number;
}
