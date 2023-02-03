import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BearerAuth } from 'src/auth/decorators/bearer-auth.decorator';
import { BearerAuthGuard } from 'src/auth/guargs/bearer-auth.guard';
import { Auth } from 'src/auth/interfaces/auth.interface';
import { pubSub } from 'src/pubsub';
import { ChatService } from './chat.service';
import { CreateChatArgs } from './dto/create-chat.args';
import { FindAllChatsWithQueryArgs } from './dto/find-all-chats-with-query.args';
import { FindAllChatsArgs } from './dto/find-all-chats.args';
import { Chat } from './entities/chat.entity';
import { ChatsCount } from './entities/chats-count.entity';

@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Chat)
  createChat(
    @BearerAuth() auth: Required<Auth>,
    @Args() args: CreateChatArgs,
  ): Promise<Chat> {
    return this.chatService.create(auth.project.id, args);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Chat])
  chats(
    @BearerAuth() auth: Required<Auth>,
    @Args() args: FindAllChatsArgs,
  ): Promise<Chat[]> {
    return this.chatService.findAll(auth.project.id, args);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Chat])
  chatsByQuery(
    @BearerAuth() auth: Required<Auth>,
    @Args() findAllChatsWithQueryArgs: FindAllChatsWithQueryArgs,
  ): Promise<Chat[]> {
    return this.chatService.findAllWithQuery(
      auth.project.id,
      findAllChatsWithQueryArgs,
    );
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => ChatsCount)
  chatsCount(@BearerAuth() auth: Required<Auth>): Observable<ChatsCount> {
    return this.chatService.countAll(auth.project.id, auth.id);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Chat)
  chat(
    @BearerAuth() auth: Required<Auth>,
    @Args('channelId', { type: () => Int }) channelId: number,
    @Args('accountId', { type: () => String }) accountId: string,
  ): Promise<Chat> {
    return this.chatService.findOne(auth.project.id, channelId, accountId);
  }

  @UseGuards(BearerAuthGuard)
  @Subscription(() => Chat, {
    filter: (payload, _variables, context) =>
      [context.req.user.id, undefined].includes(
        payload.chatReceived.contact.assignedTo?.id,
      ) || payload.chatReceived.isFlow,
  })
  async chatReceived(@BearerAuth() auth: Required<Auth>) {
    const projectId = auth.project.id;
    return pubSub.asyncIterator(`chatReceived:${projectId}`);
  }
}
