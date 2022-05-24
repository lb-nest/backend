import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { TagWithoutParentAndChildren } from 'src/tag/entities/tag.entity';

@Injectable()
export class ContactTagService {
  private readonly contactsUrl: string;

  constructor(configService: ConfigService) {
    this.contactsUrl = configService.get<string>('CONTACTS_URL');
  }

  async create(
    authorization: string,
    id: number,
    tagId: number,
  ): Promise<TagWithoutParentAndChildren> {
    try {
      const res = await axios.post<any>(
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

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async remove(
    authorization: string,
    id: number,
    tagId: number,
  ): Promise<TagWithoutParentAndChildren> {
    try {
      const res = await axios.delete<any>(
        this.contactsUrl.concat(`/contacts/${id}/tags/${tagId}`),
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
