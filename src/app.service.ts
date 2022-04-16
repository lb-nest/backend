import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

export const pubSub = new PubSub();

@Injectable()
export class AppService {
  handleEvents(projectId: number, events: any) {
    if (Array.isArray(events)) {
      events.map((event) => {
        pubSub.publish(`messagesReceived:${projectId}:${event.chat.id}`, {
          messagesReceived: event,
        });
      });
    }
  }
}
