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

  async create(authorization: string, input: CreateChatInput) {
    return;
  }

  async findAll(authorization: string) {
    return;
  }

  async findOne(authorization: string, id: number) {
    return;
  }

  async update(authorization: string, input: UpdateChatInput) {
    return;
  }

  async remove(authorization: string, id: number) {
    return;
  }
}
