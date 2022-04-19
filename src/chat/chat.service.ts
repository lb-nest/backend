import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateChatInput } from './dto/create-chat.input';

@Injectable()
export class ChatService {
  private readonly messagingUrl: string;
  private readonly contactsUrl: string;

  constructor(configService: ConfigService) {
    this.messagingUrl = configService.get<string>('MESSAGING_URL');
    this.contactsUrl = configService.get<string>('CONTACTS_URL');
  }

  async create(authorization: string, input: CreateChatInput) {
    throw new NotImplementedException();
  }

  async findAll(authorization: string) {
    const contacts = await axios(this.contactsUrl.concat('/contacts'), {
      headers: {
        authorization,
      },
    });

    const ids = contacts.data.map((contact) => contact.chatId);
    const chats = await axios(
      this.messagingUrl.concat(`/chats?ids=${ids.join(',')}`),
      {
        headers: {
          authorization,
        },
      },
    );

    return chats.data.map((chat) =>
      Object.assign(chat, {
        contact: contacts.data.find((contact) => contact.chatId === chat.id),
      }),
    );
  }

  async findOne(authorization: string, id: number) {
    const contacts = await axios(
      this.contactsUrl.concat(`/contacts?chatIds=${id}`),
      {
        headers: {
          authorization,
        },
      },
    );

    if (contacts.data.length !== 1) {
      throw new NotFoundException();
    }

    const chat = await axios(this.messagingUrl.concat(`/chats/${id}`), {
      headers: {
        authorization,
      },
    });

    return Object.assign(chat.data, {
      contact: contacts.data.find((contact) => contact.chatId === chat.data.id),
    });
  }
}
