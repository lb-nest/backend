import { ArgsType, Field } from '@nestjs/graphql';
import { IsEnum, IsString, ValidateIf } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
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

  @Field(() => GraphQLJSON)
  @ValidateIf((_, value) => ['string', 'object'].includes(typeof value))
  token: any;
}
