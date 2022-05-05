import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { History } from './entities/history.entity';
import { HistoryEventType } from './enums/history-event-type.enum';

@Injectable()
export class ContactHistoryService {
  private readonly contactsUrl: string;

  constructor(configService: ConfigService) {
    this.contactsUrl = configService.get<string>('CONTACTS_URL');
  }

  async create(
    authorization: string,
    id: number,
    eventType: HistoryEventType,
    payload?: any,
  ): Promise<History> {
    const res = await axios.post<any>(
      this.contactsUrl.concat(`/contacts/${id}/history`),
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
      const res = await axios.get<any[]>(
        this.contactsUrl.concat(`/contacts/${id}/history`),
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
