import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { User } from 'src/auth/user.decorator';
import { ChatbotService } from './chatbot.service';
import { CreateChatbotInput } from './dto/create-chatbot.input';
import { UpdateChatbotInput } from './dto/update-chatbot.input';
import { Chatbot } from './entities/chatbot.entity';

@Resolver(() => Chatbot)
export class ChatbotResolver {
  constructor(private readonly chatbotService: ChatbotService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Chatbot)
  createChatbot(
    @User() user: any,
    @Args() createChatbotInput: CreateChatbotInput,
  ): Promise<Chatbot> {
    return this.chatbotService.create(user, createChatbotInput);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Chatbot])
  chatbots(@User() user: any): Promise<Chatbot[]> {
    return this.chatbotService.findAll(user);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Chatbot)
  chatbotById(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Chatbot> {
    return this.chatbotService.findOne(user, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Chatbot)
  updateChatbot(
    @User() user: any,
    @Args() input: UpdateChatbotInput,
  ): Promise<Chatbot> {
    return this.chatbotService.update(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Chatbot)
  removeChatbot(
    @User() user: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Chatbot> {
    return this.chatbotService.remove(user, id);
  }
}
