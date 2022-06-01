import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatbotGateway } from '../chatbot.gateway';
import { ChatbotEventType } from '../enums/chatbot-event-type.enum';
import { NewAssignmentEvent } from '../events/new-assignment.event';

@Injectable()
export class NewMessageListener {
  constructor(private readonly chatbotGateway: ChatbotGateway) {}

  @OnEvent(ChatbotEventType.NewMessage)
  handleNewMesage(projectId: number, event: NewAssignmentEvent) {
    this.chatbotGateway.emit(projectId, ChatbotEventType.NewMessage, event);
  }
}
