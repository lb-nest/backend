import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { BearerAuth } from 'src/auth/decorators/bearer-auth.decorator';
import { BearerAuthGuard } from 'src/auth/guargs/bearer-auth.guard';
import { Auth } from 'src/auth/interfaces/auth.interface';
import { pubSub } from 'src/pubsub';
import { CreateMessageArgs } from './dto/create-message.args';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => [Message])
  createMessage(
    @BearerAuth() auth: Required<Auth>,
    @Args() createMessageArgs: CreateMessageArgs,
  ): Promise<Message[]> {
    return this.messageService.create(auth.project.id, createMessageArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Message])
  messages(
    @BearerAuth() auth: Required<Auth>,
    @Args('chatId', { type: () => Int }) chatId: number,
  ): Promise<Message[]> {
    return this.messageService.findAll(auth.project.id, chatId);
  }

  @UseGuards(BearerAuthGuard)
  @Subscription(() => Message)
  async messageReceived(
    @BearerAuth() auth: Required<Auth>,
    @Args('channelId', { type: () => Int }) channelId: number,
    @Args('accountId', { type: () => String }) accountId: string,
  ) {
    return pubSub.asyncIterator(
      `messageReceived:${auth.project.id}:${accountId}:${channelId}`,
    );
  }
}
