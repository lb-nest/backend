import { ArgsType, Field } from '@nestjs/graphql';
import { IsArray, IsNotEmpty } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@ArgsType()
export class CreateHsmInput {
  @Field(() => String)
  @IsNotEmpty()
  code: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  text: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsArray()
  buttons?: any[];
}
