import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CONTACTS_SERVICE } from 'src/shared/constants/broker';
import { History } from './entities/history.entity';
import { HistoryEventType } from './enums/history-event-type.enum';

@Injectable()
export class ContactHistoryService {
  constructor(@Inject(CONTACTS_SERVICE) private readonly client: ClientProxy) {}

  create(
    authorization: string,
    contactId: number,
    eventType: HistoryEventType,
    payload?: any,
  ): Observable<History> {
    return this.client.send<History>('contacts.createHistory', {
      headers: {
        authorization,
      },
      payload: {
        contactId,
        eventType,
        payload,
      },
    });
  }

  findAll(authorization: string, contactId: number): Observable<History[]> {
    return this.client.send<History[]>('contacts.findAllHistory', {
      headers: {
        authorization,
      },
      payload: contactId,
    });
  }
}
