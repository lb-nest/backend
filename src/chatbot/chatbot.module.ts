import { Module } from '@nestjs/common';
import { CHATBOTS_SERVICE } from 'src/shared/rabbitmq/constants';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';
import { ChatbotGateway } from './chatbot.gateway';
import { ChatbotResolver } from './chatbot.resolver';
import { ChatbotService } from './chatbot.service';
import { ChatbotEventListener } from './listeners/chatbot-event.listener';

@Module({
  imports: [
    RabbitMQModule.register({
      name: CHATBOTS_SERVICE,
    }),
  ],
  providers: [
    ChatbotResolver,
    ChatbotService,
    ChatbotGateway,
    ChatbotEventListener,
  ],
  exports: [ChatbotResolver, ChatbotService],
})
export class ChatbotModule {}
