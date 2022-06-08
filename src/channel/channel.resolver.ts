import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/auth/auth.decorator';
import { ChannelService } from './channel.service';
import { CreateChannelInput } from './dto/create-channel.input';
import { UpdateChannelInput } from './dto/update-channel.input';
import { Channel } from './entities/channel.entity';

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Mutation(() => Channel)
  createChannel(
    @Auth() authorization: string,
    @Args() input: CreateChannelInput,
  ): Promise<Channel> {
    return this.channelService.create(authorization, input);
  }

  @Query(() => [Channel])
  channels(@Auth() authorization: string): Promise<Channel[]> {
    return this.channelService.findAll(authorization);
  }

  @Query(() => Channel)
  channelById(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Channel> {
    return this.channelService.findOne(authorization, id);
  }

  @Mutation(() => Channel)
  updateChannel(
    @Auth() authorization: string,
    @Args() input: UpdateChannelInput,
  ): Promise<Channel> {
    return this.channelService.update(authorization, input);
  }

  @Mutation(() => Channel)
  removeChannel(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Channel> {
    return this.channelService.remove(authorization, id);
  }
}
