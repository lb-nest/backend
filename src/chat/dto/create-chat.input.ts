import { ArgsType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class CreateChatInput {
  @Field(() => String)
  @IsString()
  test: string;
}
