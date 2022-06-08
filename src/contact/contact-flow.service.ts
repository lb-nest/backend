import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import axios, { AxiosInstance } from 'axios';
import { ContactHistoryService } from './contact-history.service';
import { TransferContactInput } from './dto/transfer-contact.input';
import { ContactEventType } from './enums/contact-event-type.enum';
import { ContactStatus } from './enums/contact-status.enum';
import { HistoryEventType } from './enums/history-event-type.enum';

@Injectable()
export class ContactFlowService {
  private readonly axios: AxiosInstance;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly contactHistoryService: ContactHistoryService,
    configService: ConfigService,
  ) {
    this.axios = axios.create({
      baseURL: configService.get<string>('CONTACTS_URL'),
    });
  }

  async acceptContact(
    authorization: string,
    id: number,
    userId: number,
  ): Promise<boolean> {
    try {
      const res = await this.axios.patch<any>(
        `/contacts/${id}`,
        {
          assignedTo: userId,
        },
        {
          headers: {
            authorization,
          },
        },
      );

      await this.contactHistoryService.create(
        authorization,
        id,
        HistoryEventType.Accepted,
        {
          assignedTo: userId,
        },
      );

      this.eventEmitter.emit(ContactEventType.Update, authorization, res.data);
      return true;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async closeContact(authorization: string, id: number): Promise<boolean> {
    try {
      const res = await this.axios.patch<any>(
        `/contacts/${id}`,
        {
          assignedTo: null,
          status: ContactStatus.Closed,
        },
        {
          headers: {
            authorization,
          },
        },
      );

      await this.contactHistoryService.create(
        authorization,
        id,
        HistoryEventType.Closed,
        {},
      );

      this.eventEmitter.emit(ContactEventType.Update, authorization, res.data);
      return true;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async transferContact(
    authorization: string,
    input: TransferContactInput,
  ): Promise<boolean> {
    try {
      const res = await this.axios.patch<any>(`/contacts/${input.id}`, input, {
        headers: {
          authorization,
        },
      });

      await this.contactHistoryService.create(
        authorization,
        input.id,
        HistoryEventType.Transferred,
        {
          assignedTo: input.assignedTo,
        },
      );

      this.eventEmitter.emit(ContactEventType.Update, authorization, res.data);
      return true;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async returnContact(authorization: string, id: number): Promise<boolean> {
    try {
      const res = await this.axios.patch<any>(
        `/contacts/${id}`,
        {
          assignedTo: null,
          status: ContactStatus.Open,
        },
        {
          headers: {
            authorization,
          },
        },
      );

      await this.contactHistoryService.create(
        authorization,
        id,
        HistoryEventType.Returned,
        {},
      );

      this.eventEmitter.emit(ContactEventType.Update, authorization, res.data);
      return true;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async reopenContact(
    authorization: string,
    id: number,
    userId: number,
  ): Promise<boolean> {
    try {
      const res = await this.axios.patch<any>(
        `/contacts/${id}`,
        {
          assignedTo: userId,
          status: ContactStatus.Open,
        },
        {
          headers: {
            authorization,
          },
        },
      );

      await this.contactHistoryService.create(
        authorization,
        id,
        HistoryEventType.Reopened,
        {
          assignedTo: userId,
        },
      );

      this.eventEmitter.emit(ContactEventType.Update, authorization, res.data);
      return true;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }
}
