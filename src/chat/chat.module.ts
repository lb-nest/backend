import { Module } from '@nestjs/common';
import { ProjectModule } from 'src/project/project.module';
import { ChatController } from './chat.controller';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';

@Module({
  imports: [ProjectModule],
  providers: [ChatResolver, ChatService],
  controllers: [ChatController],
  exports: [ChatResolver, ChatService],
})
export class ChatModule {}
