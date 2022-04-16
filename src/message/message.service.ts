import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';

@Injectable()
export class MessageService {
  constructor(private readonly configService: ConfigService) {}

  async create(authorization: string, input: CreateMessageInput) {
    const url = this.configService.get<string>('MESSAGING_URL');

    try {
      const res = await axios.post(
        url.concat(`/chats/${input.chatId}/messages`),
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

  findAll(authorization: string) {
    throw new NotImplementedException();
  }

  update(authorization: string, input: UpdateMessageInput) {
    throw new NotImplementedException();
  }

  remove(authorization: string, id: number) {
    throw new NotImplementedException();
  }
}
