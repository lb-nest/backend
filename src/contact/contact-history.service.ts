import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { History } from './entities/history.entity';
import { HistoryEventType } from './enums/history-event-type.enum';

@Injectable()
export class ContactHistoryService {
  constructor(@Inject('CONTACTS') private readonly client: ClientProxy) {}

  async create(
    user: any,
    contactId: number,
    eventType: HistoryEventType,
    payload?: any,
  ): Promise<History> {
    try {
      return await lastValueFrom(
        this.client.send('contacts.history.create', {
          user,
          data: {
            contactId,
            eventType,
            payload,
          },
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll(user: any, contactId: number): Promise<History[]> {
    try {
      return await lastValueFrom(
        this.client.send<any[]>('contacts.history.findAll', {
          user,
          data: {
            contactId,
          },
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
