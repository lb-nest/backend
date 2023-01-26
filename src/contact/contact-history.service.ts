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
    projectId: number,
    contactId: number,
    eventType: HistoryEventType,
    payload?: any,
  ): Observable<History> {
    return this.client.send<History>('createContactHistory', {
      projectId,
      contactId,
      eventType,
      payload,
    });
  }

  findAll(projectId: number, contactId: number): Observable<History[]> {
    return this.client.send<History[]>('findAllContactHistory', {
      projectId,
      contactId,
    });
  }
}
