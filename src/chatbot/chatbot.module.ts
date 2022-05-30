import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatbotGateway } from './chatbot.gateway';
import { ChatbotResolver } from './chatbot.resolver';
import { ChatbotService } from './chatbot.service';

@Module({
  imports: [ConfigModule],
  providers: [ChatbotResolver, ChatbotService, ChatbotGateway],
})
export class ChatbotModule {}
