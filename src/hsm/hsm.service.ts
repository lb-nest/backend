import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { CreateHsmInput } from './dto/create-hsm.input';
import { UpdateHsmInput } from './dto/update-hsm.input';
import { Hsm } from './entities/hsm.entity';

@Injectable()
export class HsmService {
  private readonly axios: AxiosInstance;

  constructor(configService: ConfigService) {
    this.axios = axios.create({
      baseURL: configService.get<string>('MESSAGING_URL'),
    });
  }

  async create(authorization: string, input: CreateHsmInput): Promise<Hsm> {
    try {
      const res = await this.axios.post<Hsm>('/hsm', input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.responsde.data);
    }
  }

  async findAll(authorization: string): Promise<Hsm[]> {
    try {
      const res = await this.axios.get<Hsm[]>('/hsm', {
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
      const res = await this.axios.get<Hsm>(`/hsm/${id}`, {
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
      const res = await this.axios.patch<Hsm>(`/hsm/${input.id}`, input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.responsde.data);
    }
  }

  async remove(authorization: string, id: number): Promise<Hsm> {
    try {
      const res = await this.axios.delete<Hsm>(`/hsm/${id}`, {
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
