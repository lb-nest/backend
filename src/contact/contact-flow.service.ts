import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ContactHistoryService } from './contact-history.service';
import { TransferContactInput } from './dto/transfer-contact.input';
import { ContactEventType } from './enums/contact-event-type.enum';
import { ContactStatus } from './enums/contact-status.enum';
import { HistoryEventType } from './enums/history-event-type.enum';

@Injectable()
export class ContactFlowService {
  constructor(
    @Inject('CONTACTS') private readonly client: ClientProxy,
    private readonly eventEmitter: EventEmitter2,
    private readonly contactHistoryService: ContactHistoryService,
  ) {}

  async acceptContact(user: any, id: number): Promise<boolean> {
    try {
      const contact = await lastValueFrom(
        this.client.send('contacts.update', {
          user,
          data: {
            id,
            assignedTo: user.id,
          },
        }),
      );

      await this.contactHistoryService.create(
        user,
        id,
        HistoryEventType.Accepted,
        {
          assignedTo: user.id,
        },
      );

      this.eventEmitter.emit(ContactEventType.Update, user, contact);
      return true;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async closeContact(user: any, id: number): Promise<boolean> {
    try {
      const contact = await lastValueFrom(
        this.client.send('contacts.update', {
          user,
          data: {
            id,
            assignedTo: null,
            status: ContactStatus.Closed,
          },
        }),
      );

      await this.contactHistoryService.create(
        user,
        id,
        HistoryEventType.Closed,
        {},
      );

      this.eventEmitter.emit(ContactEventType.Update, user, contact);
      return true;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async transferContact(
    user: any,
    input: TransferContactInput,
  ): Promise<boolean> {
    try {
      const contact = await lastValueFrom(
        this.client.send('contacts.update', {
          user,
          data: input,
        }),
      );

      await this.contactHistoryService.create(
        user,
        input.id,
        HistoryEventType.Transferred,
        {
          assignedTo: input.assignedTo,
        },
      );

      this.eventEmitter.emit(ContactEventType.Update, user, contact);
      return true;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async returnContact(user: any, id: number): Promise<boolean> {
    try {
      const contact = await lastValueFrom(
        this.client.send('contacts.update', {
          user,
          data: {
            id,
            assignedTo: null,
            status: ContactStatus.Open,
          },
        }),
      );

      await this.contactHistoryService.create(
        user,
        id,
        HistoryEventType.Returned,
        {},
      );

      this.eventEmitter.emit(ContactEventType.Update, user, contact);
      return true;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async reopenContact(user: any, id: number): Promise<boolean> {
    try {
      const contact = await lastValueFrom(
        this.client.send('contacts.update', {
          user,
          data: {
            id,
            assignedTo: user.id,
            status: ContactStatus.Open,
          },
        }),
      );

      await this.contactHistoryService.create(
        user,
        id,
        HistoryEventType.Reopened,
        {
          assignedTo: user.id,
        },
      );

      this.eventEmitter.emit(ContactEventType.Update, user, contact);
      return true;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
