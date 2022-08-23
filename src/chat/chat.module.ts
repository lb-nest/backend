import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { ChatController } from './chat.controller';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [ChatResolver, ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
