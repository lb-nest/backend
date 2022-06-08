import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { CreateChannelInput } from './dto/create-channel.input';
import { UpdateChannelInput } from './dto/update-channel.input';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelService {
  private readonly axios: AxiosInstance;

  constructor(configService: ConfigService) {
    this.axios = axios.create({
      baseURL: configService.get<string>('MESSAGING_URL'),
    });
  }

  async create(
    authorization: string,
    input: CreateChannelInput,
  ): Promise<Channel> {
    try {
      const res = await this.axios.post<Channel>('/channels', input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.data);
    }
  }

  async findAll(authorization: string): Promise<Channel[]> {
    try {
      const res = await this.axios.get<Channel[]>('/channels', {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.body);
    }
  }

  async findOne(authorization: string, id: number): Promise<Channel> {
    try {
      const res = await this.axios.get<Channel>(`/channels/${id}`, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.body);
    }
  }

  async update(
    authorization: string,
    input: UpdateChannelInput,
  ): Promise<Channel> {
    try {
      const res = await this.axios.patch<Channel>(
        `/channels/${input.id}`,
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.body);
    }
  }

  async remove(authorization: string, id: number): Promise<Channel> {
    try {
      const res = await this.axios.delete<Channel>(`/channels/${id}`, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.body);
    }
  }
}
