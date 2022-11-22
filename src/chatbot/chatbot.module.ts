import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { ChatbotGateway } from './chatbot.gateway';
import { ChatbotResolver } from './chatbot.resolver';
import { ChatbotService } from './chatbot.service';
import { ChatbotEventListener } from './listeners/chatbot-event.listener';
import { ChatbotController } from './chatbot.controller';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [
    ChatbotEventListener,
    ChatbotGateway,
    ChatbotResolver,
    ChatbotService,
  ],
  exports: [ChatbotService],
  controllers: [ChatbotController],
})
export class ChatbotModule {}
