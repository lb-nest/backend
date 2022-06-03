import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import axios, { AxiosInstance } from 'axios';
import { decode, JwtPayload } from 'jsonwebtoken';
import { pubSub } from 'src/app.service';
import { ProjectService } from 'src/project/project.service';
import { ContactEventType } from '../enums/contact-event-type.enum';

@Injectable()
export class ContactUpdateListener {
  private readonly axios: AxiosInstance;

  constructor(
    private readonly projectService: ProjectService,
    configService: ConfigService,
  ) {
    this.axios = axios.create({
      baseURL: configService.get<string>('MESSAGING_URL'),
    });
  }

  @OnEvent(ContactEventType.Update)
  async handleContactUpdateEvent(authorization: string, contact: any) {
    const chat = await this.axios.get<any>(`/chats/${contact.chatId}`, {
      headers: {
        authorization,
      },
    });

    if (contact.assignedTo) {
      const [user] = await this.projectService.getUsers(
        authorization,
        contact.assignedTo,
      );

      contact.assignedTo = user;
    }

    const user = <JwtPayload>decode(authorization.slice(7));
    pubSub.publish(`chatsReceived:${user.project.id}`, {
      chatsReceived: Object.assign(chat.data, {
        contact,
        isFlow: true,
      }),
    });
  }
}
