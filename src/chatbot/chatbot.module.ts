import { Module } from '@nestjs/common';
import { ChatbotGateway } from './chatbot.gateway';
import { ChatbotResolver } from './chatbot.resolver';
import { ChatbotService } from './chatbot.service';
import { ChatbotEventListener } from './listeners/chatbot-event.listener';

@Module({
  providers: [
    ChatbotResolver,
    ChatbotGateway,
    ChatbotService,
    ChatbotEventListener,
  ],
  exports: [ChatbotService],
})
export class ChatbotModule {}
