import { ArgsType, Field } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { ChannelType } from '../enums/channel-type.enum';

@ArgsType()
export class CreateChannelArgs {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => ChannelType)
  @IsEnum(ChannelType)
  type: ChannelType;

  @Field(() => String)
  @IsString()
  accountId: string;

  @Field(() => String)
  @IsString()
  token: string;
}
