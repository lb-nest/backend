import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CONTACTS_SERVICE } from 'src/shared/constants/broker';
import { ContactAssignedToService } from './contact-assigned-to.service';
import { CreateContactArgs } from './dto/create-contact.args';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactChatService {
  constructor(
    @Inject(CONTACTS_SERVICE) private readonly client: ClientProxy,
    private readonly contactAssignedToService: ContactAssignedToService,
  ) {}

  async createForChat(
    projectId: number,
    channelId: number,
    accountId: string,
    createContactArgs: CreateContactArgs,
  ): Promise<Contact> {
    const [contact] = await this.contactAssignedToService.forContact(
      projectId,
      await lastValueFrom(
        this.client.send<Contact>('createContactForChat', {
          projectId,
          channelId,
          accountId,
          ...createContactArgs,
        }),
      ),
    );

    return contact;
  }

  async createChatFor(
    projectId: number,
    contactId: number,
    channelId: number,
    accountId: string,
  ): Promise<Contact> {
    const [contact] = await this.contactAssignedToService.forContact(
      projectId,
      await lastValueFrom(
        this.client.send<Contact>('createChatForContact', {
          projectId,
          contactId,
          channelId,
          accountId,
        }),
      ),
    );

    return contact;
  }

  async findOne(
    projectId: number,
    channelId: number,
    accountId: string,
  ): Promise<Contact> {
    const [contact] = await this.contactAssignedToService.forContact(
      projectId,
      await lastValueFrom(
        this.client.send<Contact>('findOneContactWithChat', {
          projectId,
          accountId,
          channelId,
        }),
      ),
    );

    return contact;
  }
}
