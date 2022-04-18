import { Args, Int, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/auth/auth.decorator';
import { ChatService } from './chat.service';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { Chat } from './entities/chat.entity';

@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  createChat(@Auth() authorization: string, @Args() input: CreateChatInput) {
    return this.chatService.create(authorization, input);
  }

  chats(@Auth() authorization: string) {
    return this.chatService.findAll(authorization);
  }

  chatById(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.chatService.findOne(authorization, id);
  }

  updateChat(@Auth() authorization: string, @Args() input: UpdateChatInput) {
    return this.chatService.update(authorization, input);
  }

  removeChat(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.chatService.remove(authorization, id);
  }
}
