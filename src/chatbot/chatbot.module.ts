import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { ChatbotGateway } from './chatbot.gateway';
import { ChatbotResolver } from './chatbot.resolver';
import { ChatbotService } from './chatbot.service';
import { ChatbotEventListener } from './listeners/chatbot-event.listener';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [
    ChatbotResolver,
    ChatbotGateway,
    ChatbotEventListener,
    ChatbotGateway,
    ChatbotService,
  ],
  exports: [ChatbotService],
})
export class ChatbotModule {}
