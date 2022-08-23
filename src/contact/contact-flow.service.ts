import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { decode } from 'jsonwebtoken';
import { lastValueFrom } from 'rxjs';
import { TokenPayload } from 'src/auth/entities/token-payload.entity';
import { CONTACTS_SERVICE } from 'src/shared/constants/broker';
import { ContactHistoryService } from './contact-history.service';
import { TransferContactArgs } from './dto/transfer-contact.args';
import { AssigneeType } from './enums/assignee-type.enum';
import { ContactEventType } from './enums/contact-event-type.enum';
import { ContactStatus } from './enums/contact-status.enum';
import { HistoryEventType } from './enums/history-event-type.enum';

@Injectable()
export class ContactFlowService {
  constructor(
    @Inject(CONTACTS_SERVICE) private readonly client: ClientProxy,
    private readonly eventEmitter: EventEmitter2,
    private readonly contactHistoryService: ContactHistoryService,
  ) {}

  async accept(authorization: string, id: number): Promise<boolean> {
    const user = <Required<TokenPayload>>decode(authorization.slice(7));
    const contact = await lastValueFrom(
      this.client.send('contacts.update', {
        headers: {
          authorization,
        },
        payload: {
          id,
          assignedTo: {
            id: user.id,
          },
        },
      }),
    );

    await lastValueFrom(
      this.contactHistoryService.create(
        authorization,
        id,
        HistoryEventType.Assign,
        {
          assignedTo: {
            id: user.id,
          },
        },
      ),
    );

    this.eventEmitter.emit(ContactEventType.Update, authorization, contact);
    return true;
  }

  async close(authorization: string, id: number): Promise<boolean> {
    const contact = await lastValueFrom(
      this.client.send('contacts.update', {
        headers: {
          authorization,
        },
        payload: {
          id,
          assignedTo: null,
          status: ContactStatus.Closed,
        },
      }),
    );

    await lastValueFrom(
      this.contactHistoryService.create(
        authorization,
        id,
        HistoryEventType.Close,
        {},
      ),
    );

    this.eventEmitter.emit(ContactEventType.Update, authorization, contact);
    return true;
  }

  async transfer(
    authorization: string,
    transferContactArgs: TransferContactArgs,
  ): Promise<boolean> {
    const contact = await lastValueFrom(
      this.client.send('contacts.update', {
        headers: {
          authorization,
        },
        payload: {
          id: transferContactArgs.id,
          assignedTo: {
            id: transferContactArgs.assignedTo,
            type: transferContactArgs.type,
          },
        },
      }),
    );

    await lastValueFrom(
      this.contactHistoryService.create(
        authorization,
        transferContactArgs.id,
        HistoryEventType.Assign,
        {
          assignedTo: transferContactArgs.assignedTo,
        },
      ),
    );

    this.eventEmitter.emit(ContactEventType.Update, authorization, contact);
    return true;
  }

  async return(authorization: string, id: number): Promise<boolean> {
    const contact = await lastValueFrom(
      this.client.send('contacts.update', {
        headers: {
          authorization,
        },
        payload: {
          id,
          assignedTo: null,
          status: ContactStatus.Open,
        },
      }),
    );

    await lastValueFrom(
      this.contactHistoryService.create(
        authorization,
        id,
        HistoryEventType.BackToQueue,
        {},
      ),
    );

    this.eventEmitter.emit(ContactEventType.Update, authorization, contact);
    return true;
  }

  async reopen(authorization: string, id: number): Promise<boolean> {
    const user = <Required<TokenPayload>>decode(authorization.slice(7));

    const contact = await lastValueFrom(
      this.client.send('contacts.update', {
        headers: {
          authorization,
        },
        payload: {
          id,
          assignedTo: {
            id: user.id,
            // TODO: type
          },
          status: ContactStatus.Open,
        },
      }),
    );

    await lastValueFrom(
      this.contactHistoryService.create(
        authorization,
        id,
        HistoryEventType.Assign,
        {
          assignedTo: user.id,
        },
      ),
    );

    this.eventEmitter.emit(ContactEventType.Update, authorization, contact);
    return true;
  }
}
