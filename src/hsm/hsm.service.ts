import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateHsmInput } from './dto/create-hsm.input';
import { UpdateHsmInput } from './dto/update-hsm.input';

@Injectable()
export class HsmService {
  constructor(private readonly configService: ConfigService) {}

  async create(authorization: string, input: CreateHsmInput) {
    const url = this.configService.get<string>('MESSAGING_URL');
    try {
      const res = await axios.post(url.concat('/hsm'), input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.responsde.data);
    }
  }

  async findAll(authorization: string) {
    const url = this.configService.get<string>('MESSAGING_URL');
    try {
      const res = await axios.get(url.concat('/hsm'), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.responsde.data);
    }
  }

  async findOne(authorization: string, id: number) {
    const url = this.configService.get<string>('MESSAGING_URL');
    try {
      const res = await axios.get(url.concat(`/hsm/${id}`), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.responsde.data);
    }
  }

  async update(authorization: string, input: UpdateHsmInput) {
    const url = this.configService.get<string>('MESSAGING_URL');
    try {
      const res = await axios.patch(url.concat(`/hsm/${input.id}`), input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.responsde.data);
    }
  }

  async remove(authorization: string, id: number) {
    const url = this.configService.get<string>('MESSAGING_URL');
    try {
      const res = await axios.delete(url.concat(`/hsm/${id}`), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.responsde.data);
    }
  }
}
