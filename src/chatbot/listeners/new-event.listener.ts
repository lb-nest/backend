import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatbotService } from '../chatbot.service';
import { ChatbotEventType } from '../enums/chatbot-event-type.enum';

@Injectable()
export class NewEventListener {
  constructor(private readonly chatbotService: ChatbotService) {}

  @OnEvent(ChatbotEventType.NewEvent)
  handleNewEvent(event: any) {
    this.chatbotService.sendNewEvent(event.projectId, event);
  }
}
