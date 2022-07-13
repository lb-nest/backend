import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { pubSub } from 'src/app.service';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { User } from 'src/auth/user.decorator';
import { ChatService } from './chat.service';
import { ChatsInput } from './dto/chats.input';
import { CreateChatInput } from './dto/create-chat.input';
import { Chat } from './entities/chat.entity';
import { ChatsCount } from './entities/chats-count.entity';

@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Chat)
  createChat(@User() user: any, @Args() input: CreateChatInput) {
    return this.chatService.create(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Chat])
  chats(@User() user: any, @Args() input: ChatsInput) {
    return this.chatService.findAll(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Chat])
  chatsByQuery(
    @User() user: any,
    @Args('query', { type: () => String }) query: string,
  ) {
    return this.chatService.findWithQuery(user, query);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => ChatsCount)
  chatsCount(@User() user: any) {
    return this.chatService.count(user);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Chat)
  chatById(@User() user: any, @Args('id', { type: () => Int }) id: number) {
    return this.chatService.findOne(user, id);
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
