import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Transform, TransformFnParams } from 'class-transformer';
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
  @Transform(({ value }: TransformFnParams) => value.trim())
  username?: string;

  @Field(() => String)
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  name: string;
}
