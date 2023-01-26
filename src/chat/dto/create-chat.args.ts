import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@ArgsType()
export class CreateChatArgs {
  @Field(() => Int)
  @IsInt()
  contactId: number;

  @Field(() => Int)
  @IsInt()
  channelId: number;

  @Field(() => String)
  @IsString()
  accountId: string;
}
