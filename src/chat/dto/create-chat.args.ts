import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@ArgsType()
export class CreateChatArgs {
  @Field(() => Int)
  @IsInt()
  channelId: number;

  @Field(() => Int)
  @IsInt()
  contactId: number;
}
