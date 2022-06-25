import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { AttachmentType } from '../enums/attachment-type.enum';

@InputType()
export class CreateAttachmentInput {
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
