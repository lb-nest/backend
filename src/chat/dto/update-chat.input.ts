import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreateChatInput } from './create-chat.input';

@ArgsType()
export class UpdateChatInput extends PartialType(CreateChatInput) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
