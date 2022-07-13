import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { User } from 'src/auth/user.decorator';
import { ChannelService } from './channel.service';
import { CreateChannelInput } from './dto/create-channel.input';
import { UpdateChannelInput } from './dto/update-channel.input';
import { Channel } from './entities/channel.entity';

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Channel)
  createChannel(
    @User() user: any,
    @Args() input: CreateChannelInput,
  ): Promise<Channel> {
    return this.channelService.create(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Channel])
  channels(@User() user: any): Promise<Channel[]> {
    return this.channelService.findAll(user);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Channel)
  channelById(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Channel> {
    return this.channelService.findOne(user, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Channel)
  updateChannel(
    @User() user: any,
    @Args() input: UpdateChannelInput,
  ): Promise<Channel> {
    return this.channelService.update(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Channel)
  removeChannel(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Channel> {
    return this.channelService.remove(user, id);
  }
}
