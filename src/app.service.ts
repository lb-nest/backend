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

  async handleWebhook(projectId: number, payload: any): Promise<void> {
    switch (payload.type) {
      case WebhookEventType.IncomingChats:
        this.eventEmitter.emit(
          ChatbotEventType.NewEvent,
          await this.handleChatsReceived(projectId, payload.payload),
        );
        break;

      case WebhookEventType.OutgoingChats:
        await this.handleChatsReceived(projectId, payload.payload);
        break;

      case WebhookEventType.IncomingMessages:
      case WebhookEventType.OutgoingMessages:
        await this.handleMessagesReceived(projectId, payload.payload);
        break;
    }
  }

  private async handleChatsReceived(
    projectId: number,
    chat: any,
    silent = false,
  ): Promise<any> {
    const contact = await this.contactService.createForChat(
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

  private async handleMessagesReceived(
    projectId: number,
    messages: any[],
  ): Promise<void> {
    messages
      .sort((a, b) => a.id - b.id)
      .map((message) => {
        pubSub.publish(`messagesReceived:${projectId}:${message.chat.id}`, {
          messagesReceived: message,
        });
      });
  }
}
