import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@ArgsType()
export class CreateChatInput {
  @Field(() => Int)
  @IsInt()
  channelId: number;

  @Field(() => String)
  @IsString()
  accountId: string;

  @Field(() => String)
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  username?: string;

  @Field(() => String)
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;
}
