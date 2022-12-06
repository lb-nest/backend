import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { FileUpload } from 'graphql-upload';
import { lastValueFrom, mergeMap, Observable } from 'rxjs';
import { ChatService } from 'src/chat/chat.service';
import { FindAllChatsForUserArgs } from 'src/chat/dto/find-all-chats.args';
import { ChatEventType } from 'src/chat/enums/chat-event-type.enum';
import { CONTACTS_SERVICE } from 'src/shared/constants/broker';
import * as xlsx from 'xlsx';
import { ContactAssignedToService } from './contact-assigned-to.service';
import { CreateContactArgs } from './dto/create-contact.args';
import { FindAllContactsArgs } from './dto/find-all-contacts.args';
import { UpdateContactArgs } from './dto/update-contact.args';
import { Contact } from './entities/contact.entity';
import { ContactsCount } from './entities/contacts-count.entity';

@Injectable()
export class ContactService {
  constructor(
    @Inject(CONTACTS_SERVICE) private readonly client: ClientProxy,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
    private readonly contactAssignedToService: ContactAssignedToService,
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
    const [contact] = await this.contactAssignedToService.forContact(
      authorization,
      await lastValueFrom(
        this.client.send<Contact>('contacts.create', {
          headers: {
            authorization,
          },
          payload: createContactArgs,
        }),
      ),
    );

    return contact;
  }

  async createForChat(
    authorization: string,
    chatId: number,
    createContactArgs: CreateContactArgs,
  ): Promise<Contact> {
    const [contact] = await this.contactAssignedToService.forContact(
      authorization,
      await lastValueFrom(
        this.client.send<Contact>('contacts.createForChat', {
          headers: {
            authorization,
          },
          payload: {
            chatId,
            ...createContactArgs,
          },
        }),
      ),
    );

    return contact;
  }

  createChatFor(
    authorization: string,
    id: number,
    chatId: number,
  ): Observable<boolean> {
    return this.client.send<boolean>('contacts.createChatFor', {
      headers: {
        authorization,
      },
      payload: {
        id,
        chatId,
      },
    });
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

    return this.contactAssignedToService.forContact(authorization, ...contacts);
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

    return this.contactAssignedToService.forContact(authorization, ...contacts);
  }

  async findOne(authorization: string, id: number): Promise<Contact> {
    const [contact] = await this.contactAssignedToService.forContact(
      authorization,
      await lastValueFrom(
        this.client.send<Contact>('contacts.findOne', {
          headers: {
            authorization,
          },
          payload: id,
        }),
      ),
    );

    return contact;
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

    return this.contactAssignedToService.forContact(authorization, ...contacts);
  }

  async update(
    authorization: string,
    updateContactArgs: UpdateContactArgs,
  ): Promise<Contact> {
    const [contact] = await this.contactAssignedToService.forContact(
      authorization,
      await lastValueFrom(
        this.client.send<Contact>('contacts.update', {
          headers: {
            authorization,
          },
          payload: updateContactArgs,
        }),
      ),
    );

    this.eventEmitter.emit(
      ChatEventType.ContactUpdated,
      authorization,
      contact.chats[0]?.id,
      contact,
    );

    return contact;
  }

  async remove(authorization: string, id: number): Promise<Contact> {
    const [contact] = await this.contactAssignedToService.forContact(
      authorization,
      await lastValueFrom(
        this.client.send<Contact>('contacts.remove', {
          headers: {
            authorization,
          },
          payload: id,
        }),
      ),
    );

    await Promise.allSettled(
      contact.chats.map((chat) =>
        lastValueFrom(this.chatService.remove(authorization, chat.id)),
      ),
    );

    // TODO: websockets
    return contact;
  }

  countAll(authorization: string): Observable<ContactsCount> {
    return this.client.send<ContactsCount>('contacts.countAll', {
      headers: {
        authorization,
      },
      payload: null,
    });
  }
}
