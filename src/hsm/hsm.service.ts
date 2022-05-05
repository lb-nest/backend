import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateHsmInput } from './dto/create-hsm.input';
import { UpdateHsmInput } from './dto/update-hsm.input';
import { Hsm } from './entities/hsm.entity';

@Injectable()
export class HsmService {
  private readonly messagingUrl: string;

  constructor(configService: ConfigService) {
    this.messagingUrl = configService.get<string>('MESSAGING_URL');
  }

  async create(authorization: string, input: CreateHsmInput): Promise<Hsm> {
    try {
      const res = await axios.post<any>(
        this.messagingUrl.concat('/hsm'),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.responsde.data);
    }
  }

  async findAll(authorization: string): Promise<Hsm[]> {
    try {
      const res = await axios.get<any[]>(this.messagingUrl.concat('/hsm'), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.responsde.data);
    }
  }

  async findOne(authorization: string, id: number): Promise<Hsm> {
    try {
      const res = await axios.get<any>(this.messagingUrl.concat(`/hsm/${id}`), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.responsde.data);
    }
  }

  async update(authorization: string, input: UpdateHsmInput): Promise<Hsm> {
    try {
      const res = await axios.patch<any>(
        this.messagingUrl.concat(`/hsm/${input.id}`),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.responsde.data);
    }
  }

  async remove(authorization: string, id: number): Promise<Hsm> {
    try {
      const res = await axios.delete<any>(
        this.messagingUrl.concat(`/hsm/${id}`),
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.responsde.data);
    }
  }
}
