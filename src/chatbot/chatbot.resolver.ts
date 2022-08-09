import { Headers } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { GqlHeaders } from 'src/shared/decorators/gql-headers.decorator';
import { ChatbotService } from './chatbot.service';
import { CreateChatbotArgs } from './dto/create-chatbot.args';
import { UpdateChatbotArgs } from './dto/update-chatbot.args';
import { Chatbot } from './entities/chatbot.entity';

@Resolver(() => Chatbot)
export class ChatbotResolver {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Mutation(() => Chatbot)
  createChatbot(
    @GqlHeaders('authorization') authorization: string,
    @Args() createChatbotArgs: CreateChatbotArgs,
  ): Observable<Chatbot> {
    return this.chatbotService.create(authorization, createChatbotArgs);
  }

  @Query(() => [Chatbot])
  chatbots(
    @GqlHeaders('authorization') authorization: string,
  ): Observable<Chatbot[]> {
    return this.chatbotService.findAll(authorization);
  }

  @Query(() => Chatbot)
  chatbotById(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Chatbot> {
    return this.chatbotService.findOne(authorization, id);
  }

  @Mutation(() => Chatbot)
  updateChatbot(
    @GqlHeaders('authorization') authorization: string,
    @Args() updateChatbotArgs: UpdateChatbotArgs,
  ): Observable<Chatbot> {
    return this.chatbotService.update(authorization, updateChatbotArgs);
  }

  @Mutation(() => Chatbot)
  removeChatbot(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Chatbot> {
    return this.chatbotService.remove(authorization, id);
  }
}
