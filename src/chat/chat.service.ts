import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { ProjectService } from 'src/project/project.service';
import { URLSearchParams } from 'url';
import { ChatsInput } from './dto/chats.input';
import { CreateChatInput } from './dto/create-chat.input';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  private readonly mAxios: AxiosInstance;
  private readonly cAxios: AxiosInstance;

  constructor(
    private readonly projectService: ProjectService,
    configService: ConfigService,
  ) {
    this.mAxios = axios.create({
      baseURL: configService.get<string>('MESSAGING_URL'),
    });
    this.cAxios = axios.create({
      baseURL: configService.get<string>('CONTACTS_URL'),
    });
  }

  async create(authorization: string, input: CreateChatInput): Promise<Chat> {
    throw new NotImplementedException();
  }

  async findAll(authorization: string, input: ChatsInput): Promise<Chat[]> {
    try {
      const query = new URLSearchParams({
        status: input.status,
      });

      if (input.assignedTo) {
        query.set('assignedTo', input.assignedTo.toString());
      }

      const contacts = await this.cAxios.get<any[]>(`/contacts?${query}`, {
        headers: {
          authorization,
        },
      });

      const chatIds = contacts.data.map((c) => c.chatId);
      const chats = await this.mAxios.get<any[]>(
        `/chats?ids=${chatIds.join(',')}`,
        {
          headers: {
            authorization,
          },
        },
      );

      const assignedTo = contacts.data.map((c) => c.assignedTo).filter(Boolean);
      if (assignedTo.length > 0) {
        const users = await this.projectService.getUsers(
          authorization,
          ...assignedTo,
        );

        contacts.data.forEach((c) => {
          c.assignedTo = users.find((u) => u.id === c.assignedTo);
        });
      }

      return chats.data
        .sort((a, b) => chatIds.indexOf(a.id) - chatIds.indexOf(b.id))
        .map((chat) =>
          Object.assign(chat, {
            contact: contacts.data.find(
              (contact) => contact.chatId === chat.id,
            ),
          }),
        );
    } catch (e) {
      throw new BadRequestException(e.response?.data);
    }
  }

  async findWithQuery(
    authorization: string,
    user: any,
    query: string,
  ): Promise<Chat[]> {
    throw new NotImplementedException();
  }

  async count(authorization: string): Promise<Record<string, number>> {
    try {
      const res = await this.cAxios.get<any>('/contacts/countAll', {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response?.data);
    }
  }

  async findOne(authorization: string, id: number): Promise<Chat> {
    try {
      const contacts = await this.cAxios.get<any[]>(
        `/contacts/findAllByChatId?chatId=${id}`,
        {
          headers: {
            authorization,
          },
        },
      );

      const [contact] = contacts.data;
      if (!contact) {
        throw new NotFoundException();
      }

      const chat = await this.mAxios.get<any>(`/chats/${id}`, {
        headers: {
          authorization,
        },
      });

      if (contact.assignedTo) {
        const [user] = await this.projectService.getUsers(
          authorization,
          contact.assignedTo,
        );

        contact.assignedTo = user;
      }

      return Object.assign(chat.data, {
        contact,
      });
    } catch (e) {
      throw new BadRequestException(e.response?.data);
    }
  }
}
