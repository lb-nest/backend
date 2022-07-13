import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Auth } from 'src/auth/auth.decorator';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { User } from 'src/auth/user.decorator';
import { pubSub } from 'src/pubsub';
import { ChatService } from './chat.service';
import { ChatsInput } from './dto/chats.input';
import { CreateChatInput } from './dto/create-chat.input';
import { Chat } from './entities/chat.entity';
import { ChatsCount } from './entities/chats-count.entity';

@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => Chat)
  createChat(@Auth() authorization: string, @Args() input: CreateChatInput) {
    return this.chatService.create(authorization, input);
  }

  @Query(() => [Chat])
  chats(@Auth() authorization: string, @Args() input: ChatsInput) {
    return this.chatService.findAll(authorization, input);
  }

  @Query(() => [Chat])
  chatsByQuery(
    @Auth() authorization: string,
    @User() user: any,
    @Args('query', { type: () => String }) query: string,
  ) {
    return this.chatService.findWithQuery(authorization, user, query);
  }

  @Query(() => ChatsCount)
  chatsCount(@Auth() authorization: string) {
    return this.chatService.count(authorization);
  }

  @Query(() => Chat)
  chatById(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.chatService.findOne(authorization, id);
  }

  @UseGuards(BearerAuthGuard)
  @Subscription(() => Chat, {
    filter(payload, _, context) {
      const userId = payload.chatsReceived.contact.assignedTo?.id;
      return (
        [context.req.user.id, undefined].includes(userId) ||
        payload.chatsReceived.isFlow
      );
    },
  })
  async chatsReceived(@User() user: any) {
    const projectId = user.project.id;
    return pubSub.asyncIterator(`chatsReceived:${projectId}`);
  }
}
