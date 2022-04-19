import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/auth/auth.decorator';
import { ChatService } from './chat.service';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
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

  @Mutation(() => Chat)
  updateChat(@Auth() authorization: string, @Args() input: UpdateChatInput) {
    return this.chatService.update(authorization, input);
  }

  @Mutation(() => Chat)
  removeChat(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.chatService.remove(authorization, id);
  }
}
