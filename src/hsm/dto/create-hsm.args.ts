import { ArgsType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@ArgsType()
export class CreateHsmArgs {
  @Field(() => String)
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  code: string;

  @Field(() => String)
  @IsString()
  text: string;

  @Field(() => [GraphQLJSON], { nullable: true })
  @IsOptional()
  @IsArray()
  attachments?: any[];

  @Field(() => [GraphQLJSON], { nullable: true })
  @IsOptional()
  @IsArray()
  buttons?: any[];
}
