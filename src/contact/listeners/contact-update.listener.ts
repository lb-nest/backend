import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { pubSub } from 'src/app.service';
import { ProjectService } from 'src/project/project.service';
import { ContactEventType } from '../enums/contact-event-type.enum';

@Injectable()
export class ContactUpdateListener {
  private readonly messagingUrl: string;

  constructor(
    private readonly projectService: ProjectService,
    configService: ConfigService,
  ) {
    this.messagingUrl = configService.get<string>('MESSAGING_URL');
  }

  @OnEvent(ContactEventType.Update)
  async handleContactUpdatedEvent(authorization: string, contact: any) {
    const chat = await axios.get<any>(
      this.messagingUrl.concat(`/chats/${contact.chatId}`),
      {
        headers: {
          authorization,
        },
      },
    );

    if (contact.assignedTo) {
      const [user] = await this.projectService.getUsers(
        authorization,
        contact.assignedTo,
      );

      contact.assignedTo = user;
    }

    const user: any = jwt.decode(authorization);
    pubSub.publish(`chatsReceived:${user.project.id}`, {
      chatsReceived: Object.assign(chat.data, {
        contact,
      }),
    });
  }
}