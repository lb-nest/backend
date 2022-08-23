import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AttachmentType } from '../enums/attachment-type.enum';

@ArgsType()
@InputType()
export class CreateAttachmentInput {
  @Field(() => AttachmentType)
  @IsEnum(AttachmentType)
  type: AttachmentType;

  @Field(() => String)
  @IsString()
  url: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string;
}
