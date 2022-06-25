import { ArgsType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@ArgsType()
export class CreateHsmInput {
  @Field(() => String)
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  code: string;

  @Field(() => String)
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  text: string;

  @Field(() => [GraphQLJSON], { nullable: true })
  @IsOptional()
  @IsArray()
  buttons?: any[];
}
