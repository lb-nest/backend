import { ArgsType, Field, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsSemVer,
  IsString,
} from 'class-validator';
import { GraphQLJSON } from 'graphql-type-json';

@ArgsType()
export class CreateChatbotInput {
  @Field(() => Int)
  @IsString()
  name: number;

  @Field(() => String)
  @IsOptional()
  @IsSemVer()
  version?: string;

  @Field(() => GraphQLJSON)
  @IsObject()
  flow: any;

  @Field(() => Boolean)
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
