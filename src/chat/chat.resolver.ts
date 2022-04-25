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
import { Auth } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { ChatService } from './chat.service';
import { CreateChatInput } from './dto/create-chat.input';
import { Chat } from './entities/chat.entity';

@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => Chat)
  createChat(@Auth() authorization: string, @Args() input: CreateChatInput) {
    return this.chatService.create(authorization, input);
  }

  @Query(() => [Chat])
  chats(@Auth() authorization: string) {
    return this.chatService.findAll(authorization);
  }

  @Query(() => [Chat])
  chatsByQuery(
    @Auth() authorization: string,
    @User() user: any,
    @Args('query', { type: () => String }) query: string,
  ) {
    return this.chatService.findWithQuery(authorization, user, query);
  }

  @Query(() => Chat)
  chatById(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.chatService.findOne(authorization, id);
  }

  @UseGuards(JwtAuthGuard)
  @Subscription(() => Chat, {
    filter(payload, _, context) {
      return [context.req.user.id, undefined].includes(
        payload.chatsReceived.contact.assignedTo?.id,
      );
    },
  })
  async chatsReceived(@User() user: any) {
    const projectId = user.project.id;
    return pubSub.asyncIterator(`chatsReceived:${projectId}`);
  }
}
