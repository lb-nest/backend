import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PubSub } from 'graphql-subscriptions';
import { WebhookEventType } from './webhook/enums/webhook-event-type.enum';

export const pubSub = new PubSub();

@Injectable()
export class AppService {
  private readonly contactsUrl: string;

  constructor(configService: ConfigService) {
    this.contactsUrl = configService.get<string>('CONTACTS_URL');
  }

  handleEvents(projectId: number, event: any) {
    // TODO: обмен сообщениями с сервисом ботов
    // после общения с ботом отправлять особый тип события
    // со своим набором данных.
    // На основе полученных данных принимать решение чтто делать с контактом и чатом.
    // 1 создать контакт и поместить в очередь
    // 2 создать контакт и поместить в решенные
    // if (???) {
    //     отправка запроса на бэкенд ботов
    //     в зависимости от ответа
    //     1 не делать ничего (return)
    //     что-то из вышенаписанного списка
    // }

    switch (event.type) {
      case WebhookEventType.IncomingChats:
        this.handleChats(projectId, event.payload).catch(() => null);
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
