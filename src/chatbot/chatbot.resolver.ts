import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BearerAuth } from 'src/auth/decorators/bearer-auth.decorator';
import { BearerAuthGuard } from 'src/auth/guargs/bearer-auth.guard';
import { Auth } from 'src/auth/interfaces/auth.interface';
import { ChatbotService } from './chatbot.service';
import { CreateChatbotArgs } from './dto/create-chatbot.args';
import { UpdateChatbotArgs } from './dto/update-chatbot.args';
import { Chatbot } from './entities/chatbot.entity';

@Resolver(() => Chatbot)
export class ChatbotResolver {
  constructor(private readonly chatbotService: ChatbotService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Chatbot)
  createChatbot(
    @BearerAuth() auth: Required<Auth>,
    @Args() createChatbotArgs: CreateChatbotArgs,
  ): Observable<Chatbot> {
    return this.chatbotService.create(auth.project.id, createChatbotArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Chatbot])
  chatbots(@BearerAuth() auth: Required<Auth>): Observable<Chatbot[]> {
    return this.chatbotService.findAll(auth.project.id);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => Chatbot)
  chatbotById(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Chatbot> {
    return this.chatbotService.findOne(auth.project.id, id);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Chatbot)
  updateChatbot(
    @BearerAuth() auth: Required<Auth>,
    @Args() updateChatbotArgs: UpdateChatbotArgs,
  ): Observable<Chatbot> {
    return this.chatbotService.update(auth.project.id, updateChatbotArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Chatbot)
  removeChatbot(
    @BearerAuth() auth: Required<Auth>,
    @Args('id', { type: () => Int }) id: number,
  ): Observable<Chatbot> {
    return this.chatbotService.remove(auth.project.id, id);
  }
}
