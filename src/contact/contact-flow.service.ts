import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import axios from 'axios';
import { TransferContactInput } from './dto/transfer-contact.input';
import { ContactStatus } from './enums/contact-status.enum';
import { HistoryEventType } from './enums/history-event-type';

@Injectable()
export class ContactFlowService {
  private readonly contactsUrl: string;

  constructor(
    private readonly eventEmiter: EventEmitter2,
    configService: ConfigService,
  ) {
    this.contactsUrl = configService.get<string>('CONTACTS_URL');
  }

  async acceptContact(authorization: string, id: number, userId: number) {
    try {
      const res = await axios.patch(
        this.contactsUrl.concat(`/contacts/${id}`),
        {
          assignedTo: userId,
        },
        {
          headers: {
            authorization,
          },
        },
      );

      await axios.post(
        this.contactsUrl.concat(`/contacts/${id}/history`),
        {
          eventType: HistoryEventType.Accepted,
          payload: {
            assignedTo: userId,
          },
        },
        {
          headers: {
            authorization,
          },
        },
      );

      this.eventEmiter.emit('contact.updated', authorization, res.data);
      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async closeContact(authorization: string, id: number) {
    try {
      const res = await axios.patch(
        this.contactsUrl.concat(`/contacts/${id}`),
        {
          status: ContactStatus.Closed,
        },
        {
          headers: {
            authorization,
          },
        },
      );

      await axios.post(
        this.contactsUrl.concat(`/contacts/${id}/history`),
        {
          eventType: HistoryEventType.Closed,
          payload: {},
        },
        {
          headers: {
            authorization,
          },
        },
      );

      this.eventEmiter.emit('contact.updated', authorization, res.data);
      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async transferContact(authorization: string, input: TransferContactInput) {
    try {
      const res = await axios.patch(
        this.contactsUrl.concat(`/contacts/${input.id}`),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      await axios.post(
        this.contactsUrl.concat(`/contacts/${input.id}/history`),
        {
          eventType: HistoryEventType.Transferred,
          payload: {
            assignedTo: input.assignedTo,
          },
        },
        {
          headers: {
            authorization,
          },
        },
      );

      this.eventEmiter.emit('contact.updated', authorization, res.data);
      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async returnContact(authorization: string, id: number) {
    try {
      const res = await axios.patch(
        this.contactsUrl.concat(`/contacts/${id}`),
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

      await axios.post(
        this.contactsUrl.concat(`/contacts/${id}/history`),
        {
          eventType: HistoryEventType.Returned,
          payload: {},
        },
        {
          headers: {
            authorization,
          },
        },
      );

      this.eventEmiter.emit('contact.updated', authorization, res.data);
      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async reopenContact(authorization: string, id: number, userId: number) {
    try {
      const res = await axios.patch(
        this.contactsUrl.concat(`/contacts/${id}`),
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

      await axios.post(
        this.contactsUrl.concat(`/contacts/${id}/history`),
        {
          eventType: HistoryEventType.Reopened,
          payload: {
            assignedTo: userId,
          },
        },
        {
          headers: {
            authorization,
          },
        },
      );

      this.eventEmiter.emit('contact.updated', authorization, res.data);
      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }
}
