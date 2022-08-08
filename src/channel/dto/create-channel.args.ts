import { ArgsType, Field } from '@nestjs/graphql';
import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { ChannelType } from '../enums/channel-type.enum';

@ArgsType()
export class CreateChannelArgs {
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => ChannelType)
  @IsEnum(ChannelType)
  type: ChannelType;

  @Field(() => String, { nullable: true })
  @ValidateIf(
    (object: CreateChannelArgs) => object.type === ChannelType.Whatsapp,
  )
  @IsString()
  accountId?: string;

  @Field(() => String)
  @IsString()
  token: string;
}
