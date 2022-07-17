import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  private readonly axios: AxiosInstance;

  constructor(configService: ConfigService) {
    this.axios = axios.create({
      baseURL: configService.get<string>('CONTACTS_URL'),
    });
  }

  async create(authorization: string, input: CreateTagInput): Promise<Tag> {
    try {
      const res = await this.axios.post<Tag>('/tags', input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response?.data);
    }
  }

  async findAll(authorization: string): Promise<Tag[]> {
    try {
      const res = await this.axios.get<Tag[]>('/tags', {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response?.data);
    }
  }

  async findOne(authorization: string, id: number): Promise<Tag> {
    try {
      const res = await this.axios.get<Tag>(`/tags/${id}`, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response?.data);
    }
  }

  async update(authorization: string, input: UpdateTagInput): Promise<Tag> {
    try {
      const res = await this.axios.patch<Tag>(`/tags/${input.id}`, input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response?.data);
    }
  }

  async remove(authorization: string, id: number): Promise<Tag> {
    try {
      const res = await this.axios.delete<Tag>(`/tags/${id}`, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response?.data);
    }
  }
}
