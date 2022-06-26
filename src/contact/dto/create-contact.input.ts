import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl } from 'class-validator';

@InputType()
@ArgsType()
export class CreateContactInput {
  @Field(() => Int)
  @IsString()
  channelId: number;

  @Field(() => String)
  @IsString()
  accountId: string;

  @Field(() => String)
  @IsString()
  username: string;

  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
