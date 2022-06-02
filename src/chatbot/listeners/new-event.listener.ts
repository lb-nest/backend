import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatbotGateway } from '../chatbot.gateway';
import { ChatbotEventType } from '../enums/chatbot-event-type.enum';
import { NewAssignmentEvent } from '../events/new-assignment.event';

@Injectable()
export class NewEventListener {
  constructor(private readonly chatbotGateway: ChatbotGateway) {}

  @OnEvent(ChatbotEventType.NewEvent)
  handleNewAssignment(projectId: number, event: NewAssignmentEvent) {
    this.chatbotGateway.emit(projectId, ChatbotEventType.NewEvent, event);
  }
}
