import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreateChatbotInput } from './create-chatbot.input';

@ArgsType()
export class UpdateChatbotInput extends PartialType(CreateChatbotInput) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
