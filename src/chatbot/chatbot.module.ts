import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatbotGateway } from './chatbot.gateway';
import { ChatbotResolver } from './chatbot.resolver';
import { ChatbotService } from './chatbot.service';
import { NewAssignmentListener } from './listeners/new-assignment.listener';
import { NewMessageListener } from './listeners/new-message.listener';

@Module({
  imports: [ConfigModule],
  providers: [
    ChatbotResolver,
    ChatbotService,
    ChatbotGateway,
    NewAssignmentListener,
    NewMessageListener,
  ],
})
export class ChatbotModule {}
