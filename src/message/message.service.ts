import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { CreateMessageInput } from './dto/create-message.input';
import { ReadMessagesInput } from './dto/read-messages.dto';
import { RemoveMessageInput } from './dto/remove-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  private readonly mAxios: AxiosInstance;
  private readonly cAxios: AxiosInstance;

  constructor(configService: ConfigService) {
    this.mAxios = axios.create({
      baseURL: configService.get<string>('MESSAGING_URL'),
    });
    this.cAxios = axios.create({
      baseURL: configService.get<string>('CONTACTS_URL'),
    });
  }

  async create(
    authorization: string,
    user: any,
    input: CreateMessageInput,
  ): Promise<Message[]> {
    try {
      const contacts = await this.cAxios.get<any>(
        `/contacts/filter?chatIds=${input.chatId}`,
        {
          headers: {
            authorization,
          },
        },
      );

      const [contact] = contacts.data;
      if (![user.id].includes(contact?.assignedTo)) {
        throw new ForbiddenException();
      }

      const res = await this.mAxios.post<any[]>(
        `/chats/${input.chatId}/messages`,
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
      const contacts = await this.cAxios.get<any[]>(
        `/contacts/filter?chatIds=${chatId}`,
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

      const res = await this.mAxios.get(`/chats/${chatId}/messages`, {
        headers: {
          authorization,
        },
      });

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
    input: RemoveMessageInput,
  ): Promise<Message> {
    throw new NotImplementedException();
  }

  async markAsRead(
    authorization: string,
    user: any,
    input: ReadMessagesInput,
  ): Promise<boolean> {
    try {
      const contacts = await this.cAxios.get<any[]>(
        `/contacts/filter?chatIds=${input.chatId}`,
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

      const res = await this.mAxios.put(
        `/chats/${input.chatId}/messages/read`,
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
}
