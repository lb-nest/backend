import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateChannelInput } from './dto/create-channel.input';
import { UpdateChannelInput } from './dto/update-channel.input';

@Injectable()
export class ChannelService {
  private readonly messagingUrl: string;

  constructor(configService: ConfigService) {
    this.messagingUrl = configService.get<string>('MESSAGING_URL');
  }

  async create(authorization: string, input: CreateChannelInput) {
    try {
      const res = await axios.post(
        this.messagingUrl.concat('/channels'),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.data);
    }
  }

  async findAll(authorization: string) {
    try {
      const res = await axios.get(this.messagingUrl.concat('/channels'), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.body);
    }
  }

  async findOne(authorization: string, id: number) {
    try {
      const res = await axios.get(this.messagingUrl.concat(`/channels/${id}`), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.body);
    }
  }

  async update(authorization: string, input: UpdateChannelInput) {
    try {
      const res = await axios.patch(
        this.messagingUrl.concat(`/channels/${input.id}`),
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

  async remove(authorization: string, id: number) {
    try {
      const res = await axios.delete(
        this.messagingUrl.concat(`/channels/${id}`),
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
}
