import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';

@Module({
  imports: [ConfigModule],
  providers: [ChatResolver, ChatService],
})
export class ChatModule {}
