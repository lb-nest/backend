import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
class CreateAttachmentInput {
  @Field(() => String)
  @IsString()
  type: string;

  @Field(() => String)
  @IsUrl()
  url: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string;
}

@ArgsType()
export class CreateMessageInput {
  @Field(() => Int)
  @IsInt()
  chatId: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  text?: string;

  @Field(() => [CreateAttachmentInput], { nullable: true })
  @Type(() => CreateAttachmentInput)
  @ValidateNested({ each: true })
  @IsArray()
  attachments: CreateAttachmentInput[];

  @Field(() => [GraphQLJSON], { nullable: true })
  @IsOptional()
  @IsArray()
  buttons: any[];
}
