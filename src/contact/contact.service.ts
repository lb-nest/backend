import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { ProjectService } from 'src/project/project.service';
import { CreateContactInput } from './dto/create-contact.input';
import { UpdateContactInput } from './dto/update-contact.input';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactService {
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

  async create(
    authorization: string,
    chatId: number,
    contact: CreateContactInput,
  ): Promise<Contact> {
    try {
      const res = await this.cAxios.post(
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
      throw new BadRequestException(e.response.data);
    }
  }

  async findAll(authorization: string): Promise<Contact[]> {
    try {
      const contacts = await this.cAxios.get<any[]>(
        '/contacts?assignedTo=all',
        {
          headers: {
            authorization,
          },
        },
      );

      const userIds = contacts.data.map((c) => c.assignedTo).filter(Boolean);
      if (userIds.length > 0) {
        const users = await this.projectService.getUsers(
          authorization,
          userIds.join(','),
        );

        contacts.data.forEach((c) => {
          c.assignedTo = users.find((u) => u.id === c.assignedTo);
        });
      }

      return contacts.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
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
      throw new BadRequestException(e.response.data);
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

      // TODO: оповещать вебсокеты

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
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
      throw new BadRequestException(e.response.data);
    }
  }
}
