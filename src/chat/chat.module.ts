import { Module } from '@nestjs/common';
import { ProjectModule } from 'src/project/project.module';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';

@Module({
  imports: [ProjectModule],
  providers: [ChatResolver, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
