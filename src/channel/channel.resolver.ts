import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BearerAuth } from 'src/auth/decorators/bearer-auth.decorator';
import { BearerAuthGuard } from 'src/auth/guargs/bearer-auth.guard';
import { Auth } from 'src/auth/interfaces/auth.interface';
import { ChannelService } from './channel.service';
import { CreateChannelArgs } from './dto/create-channel.args';
import { UpdateChannelArgs } from './dto/update-channel.args';
import { Channel } from './entities/channel.entity';

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Channel)
  createChannel(
    @BearerAuth() auth: Required<Auth>,
    @Args() createChannelArgs: CreateChannelArgs,
  ): Observable<Channel> {
    return this.channelService.create(auth.project.id, createChannelArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Channel])
  channels(@BearerAuth() auth: Required<Auth>): Observable<Channel[]> {
    return this.channelService.findAll(auth.project.id);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Channel)
  channelById(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Channel> {
    return this.channelService.findOne(auth.project.id, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Channel)
  updateChannel(
    @BearerAuth() auth: Required<Auth>,
    @Args() updateChannelArgs: UpdateChannelArgs,
  ): Observable<Channel> {
    return this.channelService.update(auth.project.id, updateChannelArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Channel)
  removeChannel(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Channel> {
    return this.channelService.remove(auth.project.id, id);
  }
}
