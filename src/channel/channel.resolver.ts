import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChannelService } from './channel.service';
import { CreateChannelInput } from './dto/create-channel.input';
import { UpdateChannelInput } from './dto/update-channel.input';
import { Channel } from './entities/channel.entity';

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Mutation(() => Channel)
  createChannel(@Context() context: any, @Args() input: CreateChannelInput) {
    return this.channelService.create(context.req.headers.authorization, input);
  }

  @Query(() => [Channel])
  channels(@Context() context: any) {
    return this.channelService.findAll(context.req.headers.authorization);
  }

  @Query(() => Channel)
  channelById(
    @Context() context: any,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.channelService.findOne(context.req.headers.authorization, id);
  }

  @Mutation(() => Channel)
  updateChannel(@Context() context: any, @Args() input: UpdateChannelInput) {
    return this.channelService.update(context.req.headers.authorization, input);
  }

  @Mutation(() => Channel)
  removeChannel(
    @Context() context: any,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.channelService.remove(context.req.headers.authorization, id);
  }
}
