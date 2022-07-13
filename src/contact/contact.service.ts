import {
  BadRequestException,
  Inject,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ProjectService } from 'src/project/project.service';
import { CreateContactWithoutChannelId } from './dto/create-contact-without-channel-id.input';
import { CreateContactInput } from './dto/create-contact.input';
import { ImportContactsInput } from './dto/import-contacts.input';
import { UpdateContactInput } from './dto/update-contact.input';
import { Contact } from './entities/contact.entity';
import { ContactEventType } from './enums/contact-event-type.enum';

@Injectable()
export class ContactService {
  constructor(
    @Inject('CONTACTS') private readonly contactsClient: ClientProxy,
    @Inject('MESSAGING') private readonly messagingClient: ClientProxy,
    private readonly eventEmitter: EventEmitter2,
    private readonly projectService: ProjectService,
  ) {}

  async create(user: any, input: CreateContactInput): Promise<Contact> {
    throw new NotImplementedException();
  }

  async createForChat(
    user: any,
    chatId: number,
    contact: CreateContactWithoutChannelId,
  ): Promise<Contact> {
    try {
      const contacts = await lastValueFrom(
        this.contactsClient.send('contacts.create', {
          user,
          data: {
            chatId,
            ...contact,
          },
        }),
      );

      if (contacts.assignedTo) {
        const [assignedTo] = await this.projectService.findAllUsers(
          user,
          contacts.assignedTo,
        );

        contacts.assignedTo = assignedTo;
      }

      return contacts;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll(user: any): Promise<Contact[]> {
    try {
      const contacts = await lastValueFrom(
        this.contactsClient.send<any[]>('contacts.findAll', {
          user,
          data: {
            assignedto: null,
          },
        }),
      );

      const assignedTo = contacts.map((c) => c.assignedTo).filter(Boolean);
      if (assignedTo.length > 0) {
        const users = await this.projectService.findAllUsers(
          user,
          ...assignedTo,
        );

        contacts.forEach((c) => {
          c.assignedTo = users.find((u) => u.id === c.assignedTo);
        });
      }

      return contacts;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findOne(user: any, id: number): Promise<Contact> {
    try {
      const contact = await lastValueFrom(
        this.contactsClient.send('contacts.findOne', {
          user,
          data: id,
        }),
      );

      if (contact.assignedTo) {
        const [assignedTo] = await this.projectService.findAllUsers(
          user,
          contact.assignedTo,
        );

        contact.assignedTo = assignedTo;
      }

      return contact;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async update(user: string, input: UpdateContactInput): Promise<Contact> {
    try {
      const contact = await lastValueFrom(
        this.contactsClient.send('contacts.update', {
          user,
          data: input,
        }),
      );

      await lastValueFrom(
        this.messagingClient.send('chats.update', {
          user,
          data: input,
        }),
      );

      if (contact.assignedTo) {
        const [assignedTo] = await this.projectService.findAllUsers(
          user,
          contact.assignedTo,
        );

        contact.assignedTo = assignedTo;
      }

      this.eventEmitter.emit(ContactEventType.Update, user, contact);
      return contact;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(user: any, id: number): Promise<Contact> {
    try {
      const contact = await lastValueFrom(
        this.contactsClient.send('contacts.remove', {
          user,
          data: id,
        }),
      );

      await lastValueFrom(
        this.messagingClient.send('chats.remove', {
          user,
          data: contact.chatId,
        }),
      );

      if (contact.assignedTo) {
        const [assignedTo] = await this.projectService.findAllUsers(
          user,
          contact.assignedTo,
        );

        contact.assignedTo = assignedTo;
      }

      // TODO: оповещать вебсокеты
      return contact;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async import(user: any, input: ImportContactsInput): Promise<boolean> {
    const chats = await lastValueFrom(
      this.messagingClient.send<any[]>('chats.import', {
        user,
        data: input,
      }),
    );

    await lastValueFrom(
      this.contactsClient.send('contacts.import', {
        user,
        data: chats.map(({ id, contact }) => ({
          chatId: id,
          ...contact,
        })),
      }),
    );

    return true;
  }
}
