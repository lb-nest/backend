import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/auth/auth.decorator';
import { ChatbotService } from './chatbot.service';
import { CreateChatbotInput } from './dto/create-chatbot.input';
import { UpdateChatbotInput } from './dto/update-chatbot.input';
import { Chatbot } from './entities/chatbot.entity';

@Resolver(() => Chatbot)
export class ChatbotResolver {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Mutation(() => Chatbot)
  createChatbot(
    @Auth() authorization: string,
    @Args() createChatbotInput: CreateChatbotInput,
  ): Promise<Chatbot> {
    return this.chatbotService.create(authorization, createChatbotInput);
  }

  @Query(() => [Chatbot])
  chatbots(@Auth() authorization: string): Promise<Chatbot[]> {
    return this.chatbotService.findAll(authorization);
  }

  @Query(() => Chatbot)
  chatbotById(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Chatbot> {
    return this.chatbotService.findOne(authorization, id);
  }

  @Mutation(() => Chatbot)
  updateChatbot(
    @Auth() authorization: string,
    @Args() input: UpdateChatbotInput,
  ): Promise<Chatbot> {
    return this.chatbotService.update(authorization, input);
  }

  @Mutation(() => Chatbot)
  removeChatbot(
    @Auth() authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Chatbot> {
    return this.chatbotService.remove(authorization, id);
  }
}
