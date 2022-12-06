import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { ChatController } from './chat.controller';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { ChatEventListener } from './listeners/chat-event.listener';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [ChatResolver, ChatService, ChatEventListener],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
