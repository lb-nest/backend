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
import { Auth } from 'src/auth/auth.decorator';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { TokenPayload } from 'src/auth/entities/token-payload.entity';
import { pubSub } from 'src/pubsub';
import { GqlHeaders } from 'src/shared/decorators/gql-headers.decorator';
import { ChatService } from './chat.service';
import { CreateChatArgs } from './dto/create-chat.args';
import { FindAllChatsForUserArgs } from './dto/find-chats.args';
import { Chat } from './entities/chat.entity';
import { ChatsCount } from './entities/chats-count.entity';

@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => Chat)
  createChat(
    @GqlHeaders('authorization') authorization: string,
    @Args() args: CreateChatArgs,
  ): Promise<Chat> {
    return this.chatService.create(authorization, args);
  }

  @Query(() => [Chat])
  chats(
    @GqlHeaders('authorization') authorization: string,
    @Args() args: FindAllChatsForUserArgs,
  ): Promise<Chat[]> {
    return this.chatService.findAll(authorization, args);
  }

  @Query(() => [Chat])
  chatsByQuery(
    @GqlHeaders('authorization') authorization: string,
    @Args('query', { type: () => String }) query: string,
  ): Promise<Chat[]> {
    return this.chatService.findWithQuery(authorization, query);
  }

  @Query(() => ChatsCount)
  chatsCount(
    @GqlHeaders('authorization') authorization: string,
  ): Observable<ChatsCount> {
    return this.chatService.countAll(authorization);
  }

  @Query(() => Chat)
  chatById(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Chat> {
    return this.chatService.findOne(authorization, id);
  }

  @UseGuards(BearerAuthGuard)
  @Subscription(() => Chat, {
    filter: (payload, _variables, context) =>
      [context.req.user.id, undefined].includes(
        payload.chatsReceived.contact.assignedTo?.id,
      ) || payload.chatsReceived.isFlow,
  })
  async chatsReceived(@Auth() auth: Required<TokenPayload>) {
    const projectId = auth.project.id;
    return pubSub.asyncIterator(`chatsReceived:${projectId}`);
  }
}
