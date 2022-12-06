import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { decode } from 'jsonwebtoken';
import { TokenPayload } from 'src/auth/entities/token-payload.entity';
import { ChatService } from 'src/chat/chat.service';
import { Contact } from 'src/contact/entities/contact.entity';
import { pubSub } from 'src/pubsub';
import { ChatEventType } from '../enums/chat-event-type.enum';

@Injectable()
export class ChatEventListener {
  constructor(private readonly chatService: ChatService) {}

  @OnEvent(ChatEventType.ContactUpdated)
  async handleContactUpdatedEvent(
    authorization: string,
    chatId: number | undefined,
    contact: Contact,
  ): Promise<void> {
    if (chatId) {
      const chat = await this.chatService.findOne(authorization, chatId);
      const user = <Required<TokenPayload>>decode(authorization.slice(7));
      pubSub.publish(`chatsReceived:${user.project.id}`, {
        chatsReceived: Object.assign(chat, {
          contact,
          isFlow: true,
        }),
      });
    }
  }
}
