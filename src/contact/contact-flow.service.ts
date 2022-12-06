import { Injectable } from '@nestjs/common';
import { decode } from 'jsonwebtoken';
import { lastValueFrom } from 'rxjs';
import { TokenPayload } from 'src/auth/entities/token-payload.entity';
import { ContactHistoryService } from './contact-history.service';
import { ContactService } from './contact.service';
import { TransferContactArgs } from './dto/transfer-contact.args';
import { ContactStatus } from './enums/contact-status.enum';
import { HistoryEventType } from './enums/history-event-type.enum';

@Injectable()
export class ContactFlowService {
  constructor(
    private readonly contactService: ContactService,
    private readonly contactHistoryService: ContactHistoryService,
  ) {}

  async accept(authorization: string, id: number): Promise<boolean> {
    const user = <Required<TokenPayload>>decode(authorization.slice(7));

    await Promise.all([
      this.contactService.update(authorization, {
        id,
        assignedTo: {
          id: user.id,
          type: user.type,
        },
      }),
      lastValueFrom(
        this.contactHistoryService.create(
          authorization,
          id,
          HistoryEventType.Assign,
          {
            acceptedBy: user.id,
          },
        ),
      ),
    ]);

    return true;
  }

  async close(authorization: string, id: number): Promise<boolean> {
    const user = <Required<TokenPayload>>decode(authorization.slice(7));

    await Promise.all([
      this.contactService.update(authorization, {
        id,
        assignedTo: null,
        status: ContactStatus.Closed,
      }),
      lastValueFrom(
        this.contactHistoryService.create(
          authorization,
          id,
          HistoryEventType.Close,
          {
            closedBy: user.id,
          },
        ),
      ),
    ]);

    return true;
  }

  async transfer(
    authorization: string,
    transferContactArgs: TransferContactArgs,
  ): Promise<boolean> {
    const user = <Required<TokenPayload>>decode(authorization.slice(7));

    await Promise.all([
      this.contactService.update(authorization, {
        id: transferContactArgs.id,
        assignedTo: {
          id: transferContactArgs.assignedTo,
          type: transferContactArgs.type,
        },
      }),
      lastValueFrom(
        this.contactHistoryService.create(
          authorization,
          transferContactArgs.id,
          HistoryEventType.Assign,
          {
            transferredBy: user.id,
            transferredTo: transferContactArgs.assignedTo,
          },
        ),
      ),
    ]);

    return true;
  }

  async return(authorization: string, id: number): Promise<boolean> {
    const user = <Required<TokenPayload>>decode(authorization.slice(7));

    await Promise.all([
      this.contactService.update(authorization, {
        id,
        assignedTo: null,
        status: ContactStatus.Open,
      }),
      lastValueFrom(
        this.contactHistoryService.create(
          authorization,
          id,
          HistoryEventType.Return,
          {
            returnedBy: user.id,
          },
        ),
      ),
    ]);

    return true;
  }

  async reopen(authorization: string, id: number): Promise<boolean> {
    const user = <Required<TokenPayload>>decode(authorization.slice(7));

    await Promise.all([
      this.contactService.update(authorization, {
        id,
        assignedTo: {
          id: user.id,
          type: user.type,
        },
        status: ContactStatus.Open,
      }),
      lastValueFrom(
        this.contactHistoryService.create(
          authorization,
          id,
          HistoryEventType.Assign,
          {
            reopenedBy: user.id,
          },
        ),
      ),
    ]);

    return true;
  }
}
