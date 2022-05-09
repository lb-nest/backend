import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateMessageInput } from './dto/create-message.input';
import { RemoveChatInput } from './dto/remove-chat.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  private readonly messagingUrl: string;
  private readonly contactsUrl: string;

  constructor(configService: ConfigService) {
    this.messagingUrl = configService.get<string>('MESSAGING_URL');
    this.contactsUrl = configService.get<string>('CONTACTS_URL');
  }

  async create(
    authorization: string,
    user: any,
    input: CreateMessageInput,
  ): Promise<Message[]> {
    try {
      const contacts = await axios.get(
        this.contactsUrl.concat(`/contacts/batch?chatIds=${input.chatId}`),
        {
          headers: {
            authorization,
          },
        },
      );

      const [contact] = contacts.data;
      if ([user.id, undefined].includes(contact?.assignedTo)) {
        throw new ForbiddenException();
      }

      const res = await axios.post<any[]>(
        this.messagingUrl.concat(`/chats/${input.chatId}/messages`),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.response.data);
    }
  }

  async findAll(
    authorization: string,
    user: any,
    chatId: number,
  ): Promise<Message[]> {
    try {
      const contacts = await axios.get(
        this.contactsUrl.concat(`/contacts/batch?chatIds=${chatId}`),
        {
          headers: {
            authorization,
          },
        },
      );

      const [contact] = contacts.data;
      if (![user.id, null].includes(contact?.assignedTo)) {
        throw new ForbiddenException();
      }

      const res = await axios.get(
        this.messagingUrl.concat(`/chats/${chatId}/messages`),
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e.response.data);
    }
  }

  async update(
    authorization: string,
    input: UpdateMessageInput,
  ): Promise<Message> {
    throw new NotImplementedException();
  }

  async remove(
    authorization: string,
    input: RemoveChatInput,
  ): Promise<Message> {
    throw new NotImplementedException();
  }
}
