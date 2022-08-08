import { Headers } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { GqlHeaders } from 'src/shared/decorators/gql-headers.decorator';
import { ChannelService } from './channel.service';
import { CreateChannelArgs } from './dto/create-channel.args';
import { UpdateChannelArgs } from './dto/update-channel.args';
import { Channel } from './entities/channel.entity';

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Mutation(() => Channel)
  createChannel(
    @GqlHeaders('authorization') authorization: string,
    @Args() args: CreateChannelArgs,
  ): Observable<Channel> {
    return this.channelService.create(authorization, args);
  }

  @Query(() => [Channel])
  channels(
    @GqlHeaders('authorization') authorization: string,
  ): Observable<Channel[]> {
    return this.channelService.findAll(authorization);
  }

  @Query(() => Channel)
  channelById(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Channel> {
    return this.channelService.findOne(authorization, id);
  }

  @Mutation(() => Channel)
  updateChannel(
    @GqlHeaders('authorization') authorization: string,
    @Args() args: UpdateChannelArgs,
  ): Observable<Channel> {
    return this.channelService.update(authorization, args);
  }

  @Mutation(() => Channel)
  removeChannel(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Channel> {
    return this.channelService.remove(authorization, id);
  }
}
