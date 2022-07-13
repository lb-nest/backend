import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { pubSub } from 'src/app.service';
import { ProjectService } from 'src/project/project.service';
import { ContactEventType } from '../enums/contact-event-type.enum';

@Injectable()
export class ContactUpdateListener {
  constructor(
    @Inject('MESSAGING') private readonly client: ClientProxy,
    private readonly projectService: ProjectService,
  ) {}

  @OnEvent(ContactEventType.Update)
  async handleContactUpdateEvent(user: any, contact: any): Promise<void> {
    const chat = await lastValueFrom(
      this.client.send('chats.findOne', {
        user,
        data: {
          id: contact.chatId,
        },
      }),
    );

    if (typeof contact.assignedTo === 'number') {
      const [assignedTo] = await this.projectService.getUsers(
        user,
        contact.assignedTo,
      );

      contact.assignedTo = assignedTo;
    }

    pubSub.publish(`chatsReceived:${user.project.id}`, {
      chatsReceived: Object.assign(chat.data, {
        contact,
        isFlow: true,
      }),
    });
  }
}
