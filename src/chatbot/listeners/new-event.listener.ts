import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatbotGateway } from '../chatbot.gateway';
import { ChatbotEventType } from '../enums/chatbot-event-type.enum';

@Injectable()
export class NewEventListener {
  constructor(private readonly chatbotGateway: ChatbotGateway) {}

  @OnEvent(ChatbotEventType.NewEvent)
  handleNewEvent(event: any) {
    this.chatbotGateway.emit(event.projectId, ChatbotEventType.NewEvent, event);
  }
}
