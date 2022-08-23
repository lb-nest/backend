import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChatService } from './chat.service';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @MessagePattern('chats.received')
  async received(@Payload() payload: any): Promise<void> {
    return this.chatService.received(payload.projectId, payload.payload);
  }
}
