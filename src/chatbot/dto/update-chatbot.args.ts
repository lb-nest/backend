import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreateChatbotArgs } from './create-chatbot.args';

@ArgsType()
export class UpdateChatbotArgs extends PartialType(CreateChatbotArgs) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
