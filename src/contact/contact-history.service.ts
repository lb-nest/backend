import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { History } from './entities/history.entity';
import { HistoryEventType } from './enums/history-event-type.enum';

@Injectable()
export class ContactHistoryService {
  private readonly axios: AxiosInstance;

  constructor(configService: ConfigService) {
    this.axios = axios.create({
      baseURL: configService.get<string>('CONTACTS_URL'),
    });
  }

  async create(
    authorization: string,
    id: number,
    eventType: HistoryEventType,
    payload?: any,
  ): Promise<History> {
    const res = await this.axios.post<History>(
      `/contacts/${id}/history`,
      {
        eventType,
        payload,
      },
      {
        headers: {
          authorization,
        },
      },
    );

    return res.data;
  }

  async findAll(authorization: string, id: number): Promise<History[]> {
    try {
      const res = await this.axios.get<History[]>(`/contacts/${id}/history`, {
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
