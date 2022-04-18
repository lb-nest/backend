import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ChannelStatus } from '../enums/channel-status.enum';
import { ChannelType } from '../enums/channel-type.enum';

@ObjectType()
export class Channel {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => ChannelType)
  type: ChannelType;

  @Field(() => ChannelStatus)
  status: ChannelStatus;
}
