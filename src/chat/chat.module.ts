import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from 'src/project/project.module';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';

@Module({
  imports: [ConfigModule, ProjectModule],
  providers: [ChatResolver, ChatService],
})
export class ChatModule {}
