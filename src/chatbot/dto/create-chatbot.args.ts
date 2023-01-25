import { ArgsType, Field } from '@nestjs/graphql';
import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@ArgsType()
export class CreateChatbotArgs {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  version?: string;

  @Field(() => GraphQLJSONObject)
  @IsObject()
  flow: any;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
