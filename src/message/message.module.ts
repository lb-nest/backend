import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { MessageController } from './message.controller';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [MessageResolver, MessageService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
