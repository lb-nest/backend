import { ArgsType, Field } from '@nestjs/graphql';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAttachmentInput } from 'src/message/dto/create-attachment.input';
import { CreateButtonInput } from 'src/message/dto/create-button.input';

@ArgsType()
export class CreateHsmArgs {
  @Field(() => String)
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  code: string;

  @Field(() => String)
  @IsString()
  text: string;

  @Field(() => [CreateAttachmentInput], { nullable: true })
  @Type(() => CreateAttachmentInput)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  attachments?: CreateAttachmentInput[];

  @Field(() => [CreateButtonInput], { nullable: true })
  @Type(() => CreateButtonInput)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  buttons?: CreateButtonInput[];
}
