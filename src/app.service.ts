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
    switch (event.type) {
      case 'IncomingChats':
        this.handleChats(projectId, event.payload).catch(() => null);
        break;

      case 'IncomingMessages':
      case 'OutgoingMessages':
        this.handleMessages(projectId, event.payload);
        break;
    }
  }

  private async handleChats(projectId: number, chat: any) {
    const contact = await axios.post(this.contactsUrl.concat('/contacts'), {
      projectId,
      chatId: chat.id,
      ...chat.contact,
    });

    pubSub.publish(`chatsReceived:${projectId}`, {
      chatsReceived: {
        ...chat,
        contact: contact.data,
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
