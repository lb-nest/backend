import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import axios, { AxiosInstance } from 'axios';
import { ProjectService } from 'src/project/project.service';
import { CreateContactWithoutChannelId } from './dto/create-contact-without-channel-id.input';
import { CreateContactInput } from './dto/create-contact.input';
import { ImportContactsInput } from './dto/import-contacts.input';
import { UpdateContactInput } from './dto/update-contact.input';
import { Contact } from './entities/contact.entity';
import { ContactEventType } from './enums/contact-event-type.enum';

@Injectable()
export class ContactService {
  private readonly mAxios: AxiosInstance;
  private readonly cAxios: AxiosInstance;

  constructor(
    configService: ConfigService,
    private readonly projectService: ProjectService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.mAxios = axios.create({
      baseURL: configService.get<string>('MESSAGING_URL'),
    });
    this.cAxios = axios.create({
      baseURL: configService.get<string>('CONTACTS_URL'),
    });
  }

  async create(
    authorization: string,
    input: CreateContactInput,
  ): Promise<Contact> {
    throw new NotImplementedException();
  }

  async createForChat(
    authorization: string,
    chatId: number,
    contact: CreateContactWithoutChannelId,
  ): Promise<Contact> {
    try {
      const res = await this.cAxios.post<any>(
        '/contacts',
        {
          chatId,
          ...contact,
        },
        {
          headers: {
            authorization,
          },
        },
      );

      if (res.data.assignedTo) {
        const [user] = await this.projectService.getUsers(
          authorization,
          res.data.assignedTo,
        );

        res.data.assignedTo = user;
      }

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response?.data);
    }
  }

  async findAll(authorization: string): Promise<Contact[]> {
    try {
      const contacts = await this.cAxios.get<any[]>(
        '/contacts?assignedTo=null',
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

      return contacts.data;
    } catch (e) {
      throw new BadRequestException(e.response?.data);
    }
  }

  async findOne(authorization: string, id: number): Promise<Contact> {
    try {
      const res = await this.cAxios.get<any>(`/contacts/${id}`, {
        headers: {
          authorization,
        },
      });

      if (res.data.assignedTo) {
        const [user] = await this.projectService.getUsers(
          authorization,
          res.data.assignedTo,
        );

        res.data.assignedTo = user;
      }

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response?.data);
    }
  }

  async update(
    authorization: string,
    input: UpdateContactInput,
  ): Promise<Contact> {
    try {
      const res = await this.cAxios.patch<any>(`/contacts/${input.id}`, input, {
        headers: {
          authorization,
        },
      });

      await this.mAxios.patch<any>(`/chats/${res.data.chatId}`, input, {
        headers: {
          authorization,
        },
      });

      if (res.data.assignedTo) {
        const [user] = await this.projectService.getUsers(
          authorization,
          res.data.assignedTo,
        );

        res.data.assignedTo = user;
      }

      this.eventEmitter.emit(ContactEventType.Update, authorization, res.data);
      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response?.data);
    }
  }

  async remove(authorization: string, id: number): Promise<Contact> {
    try {
      const res = await this.cAxios.delete<any>(`/contacts/${id}`, {
        headers: {
          authorization,
        },
      });

      await this.mAxios.delete<any>(`/chats/${res.data.chatId}`, {
        headers: {
          authorization,
        },
      });

      if (res.data.assignedTo) {
        const [user] = await this.projectService.getUsers(
          authorization,
          res.data.assignedTo,
        );

        res.data.assignedTo = user;
      }

      // TODO: оповещать вебсокеты
      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response?.data);
    }
  }

  async import(
    authorization: string,
    input: ImportContactsInput,
  ): Promise<boolean> {
    const chats = await this.mAxios.post<any[]>('/chats/import', input, {
      headers: {
        authorization,
      },
    });

    await this.cAxios.post<any[]>(
      '/contacts/import',
      {
        channelId: input.channelId,
        contacts: chats.data.map(({ id, contact }) => ({
          chatId: id,
          ...contact,
        })),
      },
      {
        headers: {
          authorization,
        },
      },
    );

    return true;
  }
}
