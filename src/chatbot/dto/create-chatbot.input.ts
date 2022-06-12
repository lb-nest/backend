import { ArgsType, Field } from '@nestjs/graphql';
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
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsSemVer()
  version?: string;

  @Field(() => GraphQLJSON)
  @IsObject()
  flow: any;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
