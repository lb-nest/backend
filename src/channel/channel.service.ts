import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateChannelInput } from './dto/create-channel.input';
import { UpdateChannelInput } from './dto/update-channel.input';

@Injectable()
export class ChannelService {
  constructor(private readonly configService: ConfigService) {}

  async create(authorization: string, input: CreateChannelInput) {
    const url = this.configService.get<string>('MESSAGING_URL');

    try {
      const res = await axios.post(url.concat('/channels'), input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.data);
    }
  }

  async findAll(authorization: string) {
    const url = this.configService.get<string>('MESSAGING_URL');

    try {
      const res = await axios.get(url.concat('/channels'), {
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
    const url = this.configService.get<string>('MESSAGING_URL');

    try {
      const res = await axios.get(url.concat(`/channels/${id}`), {
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
    const url = this.configService.get<string>('MESSAGING_URL');

    try {
      const res = await axios.patch(url.concat(`/channels/${input.id}`), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.body);
    }
  }

  async remove(authorization: string, id: number) {
    const url = this.configService.get<string>('MESSAGING_URL');

    try {
      const res = await axios.get(url.concat(`/channels/${id}`), {
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
