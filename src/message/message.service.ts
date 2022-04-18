import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateMessageInput } from './dto/create-message.input';
import { RemoveChatInput } from './dto/remove-chat.input';
import { UpdateMessageInput } from './dto/update-message.input';

@Injectable()
export class MessageService {
  private readonly messagingUrl: string;

  constructor(configService: ConfigService) {
    this.messagingUrl = configService.get<string>('MESSAGING_URL');
  }

  async create(authorization: string, input: CreateMessageInput) {
    try {
      const res = await axios.post(
        this.messagingUrl.concat(`/chats/${input.chatId}/messages`),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async findAll(authorization: string, chatId: number) {
    try {
      const res = await axios.get(
        this.messagingUrl.concat(`/chats/${chatId}/messages`),
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async update(authorization: string, input: UpdateMessageInput) {
    throw new NotImplementedException();
  }

  async remove(authorization: string, input: RemoveChatInput) {
    throw new NotImplementedException();
  }
}
