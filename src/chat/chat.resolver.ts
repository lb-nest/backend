import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { pubSub } from 'src/app.service';
import { Auth } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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

  @Query(() => Chat)
  chatById(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.chatService.findOne(authorization, id);
  }

  @UseGuards(JwtAuthGuard)
  @Subscription(() => Chat)
  async chatsReceived(@Context('req') req: any) {
    const projectId = req.user.project.id;
    return pubSub.asyncIterator(`chatsReceived:${projectId}`);
  }
}
