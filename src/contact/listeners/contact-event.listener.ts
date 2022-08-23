import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { decode } from 'jsonwebtoken';
import { lastValueFrom } from 'rxjs';
import { TokenPayload } from 'src/auth/entities/token-payload.entity';
import { ProjectService } from 'src/project/project.service';
import { pubSub } from 'src/pubsub';
import { MESSAGING_SERVICE } from 'src/shared/constants/broker';
import { Contact } from '../entities/contact.entity';
import { ContactEventType } from '../enums/contact-event-type.enum';

@Injectable()
export class ContactEventListener {
  constructor(
    @Inject(MESSAGING_SERVICE) private readonly client: ClientProxy,
    private readonly projectService: ProjectService,
  ) {}

  @OnEvent(ContactEventType.Update)
  async handleUpdateEvent(
    authorization: string,
    contact: Contact,
  ): Promise<void> {
    const chat = await lastValueFrom(
      this.client.send('chats.findOne', {
        headers: {
          authorization,
        },
        payload: contact.chats[0].id,
      }),
    );

    if (typeof contact.assignedTo?.id === 'number') {
      const [assignedTo] = await lastValueFrom(
        this.projectService.findAllUsers(authorization, contact.assignedTo.id),
      );

      contact.assignedTo = assignedTo;
    }

    const user = <Required<TokenPayload>>decode(authorization.slice(7));
    pubSub.publish(`chatsReceived:${user.project.id}`, {
      chatsReceived: Object.assign(chat, {
        contact,
        isFlow: true,
      }),
    });
  }
}
