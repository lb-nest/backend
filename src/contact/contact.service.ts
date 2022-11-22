import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { FileUpload } from 'graphql-upload';
import { lastValueFrom, mergeMap, Observable } from 'rxjs';
import { ChatService } from 'src/chat/chat.service';
import { FindAllChatsForUserArgs } from 'src/chat/dto/find-all-chats.args';
import { ProjectService } from 'src/project/project.service';
import { CONTACTS_SERVICE } from 'src/shared/constants/broker';
import * as xlsx from 'xlsx';
import { CreateContactArgs } from './dto/create-contact.args';
import { FindAllContactsArgs } from './dto/find-all-contacts.args';
import { UpdateContactArgs } from './dto/update-contact.args';
import { Contact } from './entities/contact.entity';
import { ContactsCount } from './entities/contacts-count.entity';
import { ContactEventType } from './enums/contact-event-type.enum';

@Injectable()
export class ContactService {
  constructor(
    @Inject(CONTACTS_SERVICE) private readonly client: ClientProxy,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
    private readonly projectService: ProjectService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  import(authorization: string, csvOrXls: FileUpload): Observable<any> {
    return new Observable<xlsx.WorkBook>((observer) => {
      const buffer: Uint8Array[] = [];
      csvOrXls
        .createReadStream()
        .on('data', buffer.push.bind(buffer))
        .on('end', async () => {
          observer.next(
            xlsx.read(Buffer.concat(buffer), {
              type: 'buffer',
            }),
          );
          observer.complete();
        })
        .on('error', observer.error.bind(observer));
    }).pipe(
      mergeMap((workbook) =>
        this.client.send<boolean>('contacts.import', {
          headers: {
            authorization,
          },
          payload: {
            contacts: xlsx.utils.sheet_to_json(
              workbook.Sheets[workbook.SheetNames[0]],
              {
                raw: true,
              },
            ),
          },
        }),
      ),
    );
  }

  async create(
    authorization: string,
    createContactArgs: CreateContactArgs,
  ): Promise<Contact> {
    const contact = await lastValueFrom(
      this.client.send<Contact>('contacts.create', {
        headers: {
          authorization,
        },
        payload: createContactArgs,
      }),
    );

    if (typeof contact.assignedTo?.id === 'number') {
      const [assignedTo] = await lastValueFrom(
        this.projectService.findAllUsers(authorization, contact.assignedTo.id),
      );

      contact.assignedTo = assignedTo;
    }

    return contact;
  }

  async createForChat(
    authorization: string,
    chatId: number,
    createContactArgs: CreateContactArgs,
  ): Promise<Contact> {
    const contact = await lastValueFrom(
      this.client.send<Contact>('contacts.createForChat', {
        headers: {
          authorization,
        },
        payload: {
          chatId,
          ...createContactArgs,
        },
      }),
    );

    if (typeof contact.assignedTo?.id === 'number') {
      const [assignedTo] = await lastValueFrom(
        this.projectService.findAllUsers(authorization, contact.assignedTo.id),
      );

      contact.assignedTo = assignedTo;
    }

    return contact;
  }

  async findAll(
    authorization: string,
    findAllContactsArgs: FindAllContactsArgs,
  ): Promise<Contact[]> {
    const contacts = await lastValueFrom(
      this.client.send<Contact[]>('contacts.findAll', {
        headers: {
          authorization,
        },
        payload: findAllContactsArgs,
      }),
    );

    const assignedTo = contacts
      .map((contact) => contact.assignedTo?.id)
      .filter(Boolean);

    if (assignedTo.length > 0) {
      const users = await lastValueFrom(
        this.projectService.findAllUsers(authorization, ...assignedTo),
      );

      for (const contact of contacts) {
        contact.assignedTo = users.find(
          (user) => user.id === contact.assignedTo?.id,
        );
      }
    }

    return contacts;
  }

  async findAllForUser(
    authorization: string,
    findAllContactForUserArgs: FindAllChatsForUserArgs,
  ): Promise<Contact[]> {
    const contacts = await lastValueFrom(
      this.client.send<Contact[]>('contacts.findAllForUser', {
        headers: {
          authorization,
        },
        payload: findAllContactForUserArgs,
      }),
    );

    const assignedTo = contacts
      .map((contact) => contact.assignedTo?.id)
      .filter(Boolean);

    if (assignedTo.length > 0) {
      const users = await lastValueFrom(
        this.projectService.findAllUsers(authorization, ...assignedTo),
      );

      for (const contact of contacts) {
        contact.assignedTo = users.find(
          (user) => user.id === contact.assignedTo?.id,
        );
      }
    }

    return contacts;
  }

  async findOneForChat(
    authorization: string,
    ...ids: number[]
  ): Promise<Contact[]> {
    const contacts = await lastValueFrom(
      this.client.send<Contact[]>('contacts.findOneForChat', {
        headers: {
          authorization,
        },
        payload: {
          ids,
        },
      }),
    );

    const assignedTo = contacts
      .map((contact) => contact.assignedTo?.id)
      .filter(Boolean);

    if (assignedTo.length > 0) {
      const users = await lastValueFrom(
        this.projectService.findAllUsers(authorization, ...assignedTo),
      );

      for (const contact of contacts) {
        contact.assignedTo = users.find(
          (user) => user.id === contact.assignedTo?.id,
        );
      }
    }

    return contacts;
  }

  countAll(authorization: string): Observable<ContactsCount> {
    return this.client.send<ContactsCount>('contacts.countAll', {
      headers: {
        authorization,
      },
      payload: null,
    });
  }

  async findOne(authorization: string, id: number): Promise<Contact> {
    const contact = await lastValueFrom(
      this.client.send<Contact>('contacts.findOne', {
        headers: {
          authorization,
        },
        payload: id,
      }),
    );

    if (typeof contact.assignedTo?.id === 'number') {
      const [assignedTo] = await lastValueFrom(
        this.projectService.findAllUsers(authorization, contact.assignedTo.id),
      );

      contact.assignedTo = assignedTo;
    }

    return contact;
  }

  async update(
    authorization: string,
    updateContactArgs: UpdateContactArgs,
  ): Promise<Contact> {
    const contact = await lastValueFrom(
      this.client.send<Contact>('contacts.update', {
        headers: {
          authorization,
        },
        payload: updateContactArgs,
      }),
    );

    await Promise.allSettled(
      contact.chats.map((chat) =>
        lastValueFrom(
          this.chatService.update(authorization, {
            id: chat.id,
            name: contact.name,
            avatarUrl: contact.avatarUrl,
          }),
        ),
      ),
    );

    if (typeof contact.assignedTo?.id === 'number') {
      const [assignedTo] = await lastValueFrom(
        this.projectService.findAllUsers(authorization, contact.assignedTo.id),
      );

      contact.assignedTo = assignedTo;
    }

    this.eventEmitter.emit(ContactEventType.Update, authorization, contact);
    return contact;
  }

  async remove(authorization: string, id: number): Promise<Contact> {
    const contact = await lastValueFrom(
      this.client.send<Contact>('contacts.remove', {
        headers: {
          authorization,
        },
        payload: id,
      }),
    );

    await Promise.allSettled(
      contact.chats.map((chat) =>
        lastValueFrom(this.chatService.remove(authorization, chat.id)),
      ),
    );

    if (typeof contact.assignedTo?.id === 'number') {
      const [assignedTo] = await lastValueFrom(
        this.projectService.findAllUsers(authorization, contact.assignedTo.id),
      );

      contact.assignedTo = assignedTo;
    }

    // TODO: оповещать вебсокеты
    return contact;
  }

  createChatForContact(
    authorization: string,
    id: number,
    chatId: number,
  ): Observable<boolean> {
    return this.client.send<boolean>('contacts.connectChat', {
      headers: {
        authorization,
      },
      payload: {
        id,
        chatId,
      },
    });
  }
}
