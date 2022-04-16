import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';

@Module({
  imports: [ConfigModule],
  providers: [MessageResolver, MessageService],
})
export class MessageModule {}
