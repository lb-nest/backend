import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@ArgsType()
export class RemoveMessageInput {
  @Field(() => Int)
  @IsInt()
  chatId: number;

  @Field(() => Int)
  @IsInt()
  id: number;
}
