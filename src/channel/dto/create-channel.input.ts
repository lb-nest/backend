import { ArgsType, Field } from '@nestjs/graphql';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsNotEmpty, ValidateIf } from 'class-validator';
import { ChannelType } from '../enums/channel-type.enum';

@ArgsType()
export class CreateChannelInput {
  @Field(() => String)
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  name: string;

  @Field(() => ChannelType)
  @IsEnum(ChannelType)
  type: ChannelType;

  @Field(() => String, { nullable: true })
  @ValidateIf((object) => object.type === ChannelType.Whatsapp)
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  accountId?: string;

  @Field(() => String)
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  token: string;
}
