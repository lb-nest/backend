import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';

@Module({
  imports: [],
  providers: [MessageResolver, MessageService],
  controllers: [MessageController],
  exports: [MessageResolver, MessageService],
})
export class MessageModule {}
