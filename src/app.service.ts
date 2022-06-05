import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PubSub } from 'graphql-subscriptions';
import { ChatbotEventType } from './chatbot/enums/chatbot-event-type.enum';
import { ContactService } from './contact/contact.service';
import { ProjectTokenService } from './project/project-token.service';
import { WebhookEventType } from './webhook/enums/webhook-event-type.enum';

export const pubSub = new PubSub();

@Injectable()
export class AppService {
  constructor(
    private readonly contactService: ContactService,
    private readonly projectTokenService: ProjectTokenService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  handleEvents(projectId: number, event: any): void {
    switch (event.type) {
      case WebhookEventType.IncomingChats:
        this.handleChats(projectId, event.payload).catch(() => undefined);
        break;

      case WebhookEventType.OutgoingChats:
        this.handleChats(projectId, event.payload)
          .then((chat) => {
            this.eventEmitter.emit(ChatbotEventType.NewEvent, chat);
          })
          .catch(() => undefined);
        break;

      case WebhookEventType.IncomingMessages:
      case WebhookEventType.OutgoingMessages:
        this.handleMessages(projectId, event.payload);
        break;
    }
  }

  private async handleChats(
    projectId: number,
    chat: any,
    silent = false,
  ): Promise<any> {
    const contact = await this.contactService.create(
      'Bearer '.concat(await this.projectTokenService.get(projectId)),
      chat.id,
      chat.contact,
    );

    if (!silent) {
      pubSub.publish(`chatsReceived:${projectId}`, {
        chatsReceived: {
          ...chat,
          contact,
        },
      });
    }

    return {
      projectId,
      ...chat,
      contact,
    };
  }

  private handleMessages(projectId: number, messages: any[]): void {
    messages.map((message) => {
      pubSub.publish(`messagesReceived:${projectId}:${message.chat.id}`, {
        messagesReceived: message,
      });
    });
  }
}
