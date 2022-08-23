import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatbotService } from '../chatbot.service';
import { ChatbotEventType } from '../enums/chatbot-event-type.enum';

@Injectable()
export class ChatbotEventListener {
  constructor(private readonly chatbotService: ChatbotService) {}

  @OnEvent(ChatbotEventType.NewEvent)
  handleEvent(event: any): void {
    return this.chatbotService.emit(event.projectId, event);
  }
}
