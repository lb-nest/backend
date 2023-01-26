import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { FileUpload } from 'graphql-upload';
import { lastValueFrom, mergeMap, Observable } from 'rxjs';
import { ChatService } from 'src/chat/chat.service';
import { ChatEventType } from 'src/chat/enums/chat-event-type.enum';
import { CONTACTS_SERVICE } from 'src/shared/constants/broker';
import * as xlsx from 'xlsx';
import { ContactAssignedToService } from './contact-assigned-to.service';
import { CreateContactArgs } from './dto/create-contact.args';
import { FindAllContactsArgs } from './dto/find-all-contacts.args';
import { UpdateContactArgs } from './dto/update-contact.args';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @Inject(CONTACTS_SERVICE) private readonly client: ClientProxy,
    private readonly chatService: ChatService,
    private readonly contactAssignedToService: ContactAssignedToService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  import(projectId: number, csvOrXls: FileUpload): Observable<any> {
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
        this.client.send<boolean>('importContacts', {
          projectId,
          contacts: xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]],
            {
              raw: true,
            },
          ),
        }),
      ),
    );
  }

  async create(
    projectId: number,
    createContactArgs: CreateContactArgs,
  ): Promise<Contact> {
    const [contact] = await this.contactAssignedToService.forContact(
      projectId,
      await lastValueFrom(
        this.client.send<Contact>('createContact', {
          projectId,
          ...createContactArgs,
        }),
      ),
    );

    return contact;
  }

  async findAll(
    projectId: number,
    findAllContactsArgs: FindAllContactsArgs,
  ): Promise<Contact[]> {
    const contacts = await lastValueFrom(
      this.client.send<Contact[]>('findAllContacts', {
        projectId,
        ...findAllContactsArgs,
      }),
    );

    return this.contactAssignedToService.forContact(projectId, ...contacts);
  }

  async findOne(projectId: number, id: number): Promise<Contact> {
    const [contact] = await this.contactAssignedToService.forContact(
      projectId,
      await lastValueFrom(
        this.client.send<Contact>('findOneContact', {
          projectId,
          id,
        }),
      ),
    );

    return contact;
  }

  async update(
    projectId: number,
    updateContactArgs: UpdateContactArgs,
  ): Promise<Contact> {
    const [contact] = await this.contactAssignedToService.forContact(
      projectId,
      await lastValueFrom(
        this.client.send<Contact>('updateContact', {
          projectId,
          ...updateContactArgs,
        }),
      ),
    );

    this.eventEmitter.emit(ChatEventType.UpdateContact, projectId, contact);

    return contact;
  }

  async remove(projectId: number, id: number): Promise<Contact> {
    const [contact] = await this.contactAssignedToService.forContact(
      projectId,
      await lastValueFrom(
        this.client.send<Contact>('removeContact', {
          projectId,
          id,
        }),
      ),
    );

    await Promise.allSettled(
      contact.chats.map((chat) =>
        lastValueFrom(
          this.chatService.remove(projectId, chat.channelId, chat.accountId),
        ),
      ),
    );

    return contact;
  }
}
