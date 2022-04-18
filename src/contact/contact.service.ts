import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UpdateContactInput } from './dto/update-contact.input';

@Injectable()
export class ContactService {
  private readonly messagingUrl: string;
  private readonly contactsUrl: string;

  constructor(configService: ConfigService) {
    this.messagingUrl = configService.get<string>('MESSAGING_URL');
    this.contactsUrl = configService.get<string>('CONTACTS_URLs');
  }

  findAll(authorization: string) {
    return;
  }

  findOne(authorization: string, id: number) {
    return;
  }

  update(authorization: string, input: UpdateContactInput) {
    return;
  }

  remove(authorization: string, id: number) {
    return;
  }
}
