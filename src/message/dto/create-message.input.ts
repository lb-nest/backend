import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
import { CreateAttachmentInput } from './create-attachment.input';

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
  @IsOptional()
  @ValidateNested({ each: true })
  attachments?: CreateAttachmentInput[];

  @Field(() => [GraphQLJSON], { nullable: true })
  @IsOptional()
  @IsObject({ each: true })
  buttons?: any[];
}
