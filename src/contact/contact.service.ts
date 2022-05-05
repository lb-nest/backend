import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ProjectService } from 'src/project/project.service';
import { CreateContactInput } from './dto/create-contact.input';
import { UpdateContactInput } from './dto/update-contact.input';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactService {
  private readonly messagingUrl: string;
  private readonly contactsUrl: string;

  constructor(
    private readonly projectService: ProjectService,
    configService: ConfigService,
  ) {
    this.messagingUrl = configService.get<string>('MESSAGING_URL');
    this.contactsUrl = configService.get<string>('CONTACTS_URL');
  }

  async create(
    authorization: string,
    chatId: number,
    contact: CreateContactInput,
  ): Promise<any> {
    try {
      const res = await axios.post(
        this.contactsUrl.concat('/contacts'),
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

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async findAll(authorization: string): Promise<Contact[]> {
    try {
      const contacts = await axios.get<any[]>(
        this.contactsUrl.concat('/contacts'),
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
      const res = await axios.get<any>(
        this.contactsUrl.concat(`/contacts/${id}`),
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

  async update(
    authorization: string,
    input: UpdateContactInput,
  ): Promise<Contact> {
    try {
      const res = await axios.patch<any>(
        this.contactsUrl.concat(`/contacts/${input.id}`),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      await axios.patch<any>(
        this.messagingUrl.concat(`/chats/${res.data.chatId}`),
        input,
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

  async remove(authorization: string, id: number): Promise<Contact> {
    try {
      const res = await axios.delete<any>(
        this.contactsUrl.concat(`/contacts/${id}`),
        {
          headers: {
            authorization,
          },
        },
      );

      await axios.delete<any>(
        this.messagingUrl.concat(`/chats/${res.data.chatId}`),
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
}
