import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { CreateAttachmentInput } from './create-attachment.input';
import { CreateButtonInput } from './create-button.input';

@ArgsType()
export class CreateMessageArgs {
  @Field(() => Int)
  @IsInt()
  chatId: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  hsmId?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  text?: string;

  @Field(() => [CreateAttachmentInput], { nullable: true })
  @Type(() => CreateAttachmentInput)
  @IsOptional()
  @ValidateNested({ each: true })
  attachments?: CreateAttachmentInput[];

  @Field(() => [CreateButtonInput], { nullable: true })
  @Type(() => CreateButtonInput)
  @IsOptional()
  @ValidateNested({ each: true })
  buttons?: CreateButtonInput[];

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @IsObject()
  variables?: Record<string, string>;
}
