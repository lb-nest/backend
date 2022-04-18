import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';

@Injectable()
export class ChatService {
  private readonly messagingUrl: string;
  private readonly contactsUrl: string;

  constructor(configService: ConfigService) {
    this.messagingUrl = configService.get<string>('MESSAGING_URL');
    this.contactsUrl = configService.get<string>('CONTACTS_URL');
  }

  async create(authorization: string, input: CreateChatInput) {}

  async findAll(authorization: string) {}

  async findOne(authorization: string, id: number) {}

  async update(authorization: string, input: UpdateChatInput) {}

  async remove(authorization: string, id: number) {}
}
