import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatService } from 'src/chat/chat.service';
import { Contact } from 'src/contact/entities/contact.entity';
import { pubSub } from 'src/pubsub';
import { ChatEventType } from '../enums/chat-event-type.enum';

@Injectable()
export class ChatEventListener {
  constructor(private readonly chatService: ChatService) {}

  @OnEvent(ChatEventType.UpdateContact)
  async handleUpdateContactEvent(
    projectId: number,
    contact: Contact,
  ): Promise<void> {
    await Promise.allSettled(
      contact.chats.map(async (chat) => {
        pubSub.publish(`chatReceived:${projectId}`, {
          chatReceived: Object.assign(
            await this.chatService.findOne(
              projectId,
              chat.channelId,
              chat.accountId,
            ),
            {
              contact,
              isFlow: true,
            },
          ),
        });
      }),
    );
  }
}
