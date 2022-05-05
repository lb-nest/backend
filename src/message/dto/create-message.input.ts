import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
import { AttachmentType } from '../enums/attachment-type.enum';

@InputType()
class CreateAttachmentInput {
  @Field(() => AttachmentType)
  @IsEnum(AttachmentType)
  type: AttachmentType;

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
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  attachments?: CreateAttachmentInput[];

  @Field(() => [GraphQLJSON], { nullable: true })
  @IsOptional()
  @IsArray()
  buttons?: any[];
}
