import { Headers } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChannelService } from './channel.service';
import { CreateChannelInput } from './dto/create-channel.input';
import { UpdateChannelInput } from './dto/update-channel.input';
import { Channel } from './entities/channel.entity';

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Mutation(() => Channel)
  createChannel(
    @Headers('authorization') authorization: string,
    @Args() input: CreateChannelInput,
  ) {
    return this.channelService.create(authorization, input);
  }

  @Query(() => [Channel])
  channels(@Headers('authorization') authorization: string) {
    return this.channelService.findAll(authorization);
  }

  @Query(() => Channel)
  channelById(
    @Headers('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.channelService.findOne(authorization, id);
  }

  @Mutation(() => Channel)
  updateChannel(
    @Headers('authorization') authorization: string,
    @Args() input: UpdateChannelInput,
  ) {
    return this.channelService.update(authorization, input);
  }

  @Mutation(() => Channel)
  removeChannel(
    @Headers('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.channelService.remove(authorization, id);
  }
}
