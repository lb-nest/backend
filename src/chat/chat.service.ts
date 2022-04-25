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
  private readonly authUrl: string;
  private readonly messagingUrl: string;
  private readonly contactsUrl: string;

  constructor(configService: ConfigService) {
    this.authUrl = configService.get<string>('AUTH_URL');
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

    const chatIds = contacts.data.map((c) => c.chatId);
    const chats = await axios.get(
      this.messagingUrl.concat(`/chats?ids=${chatIds.join(',')}`),
      {
        headers: {
          authorization,
        },
      },
    );

    const userIds = contacts.data.map((c) => c.assignedTo).filter(Boolean);
    const users = await axios.get(
      this.authUrl.concat(`/users?ids=${userIds.join(',')}`),
      {
        headers: {
          authorization,
        },
      },
    );

    contacts.data.forEach((c) => {
      c.assignedTo = users.data.find((u) => u.id === c.assignedTo);
    });

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

    const contact = contacts.data[0];
    if (!contact) {
      throw new NotFoundException();
    }

    const chat = await axios(this.messagingUrl.concat(`/chats/${id}`), {
      headers: {
        authorization,
      },
    });

    if (contact.assignedTo) {
      const user = await axios.get(
        this.authUrl.concat(`/users/${contact.assignedTo}`),
        {
          headers: {
            authorization,
          },
        },
      );

      contact.assignedTo = user.data;
    }

    return Object.assign(chat.data, {
      contact,
    });
  }
}
