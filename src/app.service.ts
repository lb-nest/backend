import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

export const pubSub = new PubSub();

@Injectable()
export class AppService {
  handleEvents(projectId: number, event: any) {
    switch (event.type) {
      case 'NewChats':
        this.handleChats(projectId, event.payload);
        break;

      case 'IncomingMessages':
      case 'OutgoingMessages':
        this.handleMessages(projectId, event.payload);
        break;
    }
  }

  private handleChats(projectId: number, chat: any) {
    // TODO: подписка на чаты
  }

  private handleMessages(projectId: number, messages: any[]) {
    messages.map((message) => {
      pubSub.publish(`messagesReceived:${projectId}:${message.chat.id}`, {
        messagesReceived: message,
      });
    });
  }
}
