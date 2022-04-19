import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PubSub } from 'graphql-subscriptions';

export const pubSub = new PubSub();

@Injectable()
export class AppService {
  private readonly contactsUrl: string;

  constructor(configService: ConfigService) {
    this.contactsUrl = configService.get<string>('CONTACTS_URL');
  }

  handleEvents(projectId: number, event: any) {
    try {
      switch (event.type) {
        case 'NewChats':
          this.handleChats(projectId, event.payload);
          break;

        case 'IncomingMessages':
        case 'OutgoingMessages':
          this.handleMessages(projectId, event.payload);
          break;
      }
    } catch {
      // TODO: log error
    }
  }

  private async handleChats(projectId: number, chat: any) {
    const contact = await axios.post(
      this.contactsUrl.concat(`/projects/${projectId}/events`),
      {
        chatId: chat.id,
        ...chat.contact,
      },
      {
        headers: {
          authorization: 'Bearer '.concat(),
        },
      },
    );

    pubSub.publish(`chatsReceived:${projectId}:${chat.id}`, {
      chatsReceived: {
        ...chat,
        contact,
      },
    });
  }

  private async handleMessages(projectId: number, messages: any[]) {
    messages.map((message) => {
      pubSub.publish(`messagesReceived:${projectId}:${message.chat.id}`, {
        messagesReceived: message,
      });
    });
  }
}
