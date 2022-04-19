import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';

@Injectable()
export class TagService {
  private readonly contactsUrl: string;

  constructor(configService: ConfigService) {
    this.contactsUrl = configService.get<string>('CONTACTS_URL');
  }

  async create(authorization: string, input: CreateTagInput) {
    try {
      const res = await axios.post(this.contactsUrl.concat('/tags'), input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async findAll(authorization: string) {
    try {
      const res = await axios.get(this.contactsUrl.concat('/tags'), {
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
      const res = await axios.get(this.contactsUrl.concat(`/tags/${id}`), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async update(authorization: string, input: UpdateTagInput) {
    try {
      const res = await axios.patch(
        this.contactsUrl.concat(`/tags/${input.id}`),
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
      const res = await axios.delete(this.contactsUrl.concat(`/tags/${id}`), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }
}
