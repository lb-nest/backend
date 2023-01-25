import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { ChatbotController } from './chatbot.controller';
import { ChatbotGateway } from './chatbot.gateway';
import { ChatbotResolver } from './chatbot.resolver';
import { ChatbotService } from './chatbot.service';
import { ChatbotEventListener } from './listeners/chatbot-event.listener';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [
    ChatbotEventListener,
    ChatbotGateway,
    ChatbotResolver,
    ChatbotService,
  ],
  controllers: [ChatbotController],
})
export class ChatbotModule {}
