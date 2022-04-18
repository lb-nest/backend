import { ArgsType, Field } from '@nestjs/graphql';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ChannelType } from '../enums/channel-type.enum';

@ArgsType()
export class CreateChannelInput {
  @Field(() => String)
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  name: string;

  @Field(() => ChannelType)
  @IsEnum(ChannelType)
  type: string;

  @Field(() => String)
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  token: string;
}
