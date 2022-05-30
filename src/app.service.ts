import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { ContactService } from './contact/contact.service';
import { ProjectTokenService } from './project/project-token.service';
import { ProjectService } from './project/project.service';
import { WebhookEventType } from './webhook/enums/webhook-event-type.enum';

export const pubSub = new PubSub();

@Injectable()
export class AppService {
  constructor(
    private readonly contactService: ContactService,
    private readonly projectService: ProjectService,
    private readonly projectTokenService: ProjectTokenService,
  ) {}

  handleEvents(projectId: number, event: any) {
    switch (event.type) {
      case WebhookEventType.IncomingChats:
      case WebhookEventType.OutgoingChats:
        this.handleChats(projectId, event.payload).catch(() => undefined);
        break;

      case WebhookEventType.IncomingMessages:
      case WebhookEventType.OutgoingMessages:
        this.handleMessages(projectId, event.payload);
        break;

      // case 'событие от бота':
      //   break
    }
  }

  private async handleChats(projectId: number, chat: any) {
    const token = await this.projectTokenService.get(projectId);
    const authorization = 'Bearer '.concat(token);

    const contact = await this.contactService.create(
      authorization,
      chat.id,
      chat.contact,
    );

    if (contact.assignedTo) {
      const [user] = await this.projectService.getUsers(
        authorization,
        contact.assignedTo,
      );

      contact.assignedTo = user;
    }

    pubSub.publish(`chatsReceived:${projectId}`, {
      chatsReceived: {
        ...chat,
        contact,
      },
    });
  }

  private handleMessages(projectId: number, messages: any[]) {
    messages.map((message) => {
      pubSub.publish(`messagesReceived:${projectId}:${message.chat.id}`, {
        messagesReceived: message,
      });
    });
  }
}
