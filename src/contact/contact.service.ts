import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UpdateContactInput } from './dto/update-contact.input';

@Injectable()
export class ContactService {
  private readonly messagingUrl: string;
  private readonly contactsUrl: string;

  constructor(configService: ConfigService) {
    this.messagingUrl = configService.get<string>('MESSAGING_URL');
    this.contactsUrl = configService.get<string>('CONTACTS_URL');
  }

  async findAll(authorization: string) {
    try {
      const res = await axios.get(this.contactsUrl.concat('/contacts'), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async findOne(authorization: string, id: number) {
    try {
      const res = await axios.get(this.contactsUrl.concat(`/contacts/${id}`), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async update(
    authorization: string,
    projectId: number,
    input: UpdateContactInput,
  ) {
    try {
      const res = await axios.patch(
        this.contactsUrl.concat(`/contacts/${input.id}`),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      await axios.patch(
        this.messagingUrl.concat(`/chats/${res.data.chatId}`),
        input,
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

  async remove(authorization: string, id: number) {
    try {
      const res = await axios.delete(
        this.contactsUrl.concat(`/contacts/${id}`),
        {
          headers: {
            authorization,
          },
        },
      );

      await axios.delete(
        this.messagingUrl.concat(`/chats/${res.data.chatId}`),
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

  async addTag(authorization: string, id: number, tagId: number) {
    try {
      const res = await axios.post(
        this.contactsUrl.concat(`/contacts/${id}/tags`),
        {
          tagId,
        },
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data.tag;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async delTag(authorization: string, id: number, tagId: number) {
    try {
      const res = await axios.delete(
        this.contactsUrl.concat(`/contacts/${id}/tags/${tagId}`),
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data.tag;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async getHistory(authorization: string, id: number) {
    try {
      const res = await axios.get(
        this.contactsUrl.concat(`/contacts/${id}/history`),
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
}
