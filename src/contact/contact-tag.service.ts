import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { TagWithoutParentAndChildren } from 'src/tag/entities/tag.entity';

@Injectable()
export class ContactTagService {
  private readonly axios: AxiosInstance;

  constructor(configService: ConfigService) {
    this.axios = axios.create({
      baseURL: configService.get<string>('CONTACTS_URL'),
    });
  }

  async create(
    authorization: string,
    id: number,
    tagId: number,
  ): Promise<TagWithoutParentAndChildren> {
    try {
      const res = await this.axios.post<any>(
        `/contacts/${id}/tags`,
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
      const res = await this.axios.delete<any>(
        `/contacts/${id}/tags/${tagId}`,
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
