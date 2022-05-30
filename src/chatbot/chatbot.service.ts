import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Socket } from 'socket.io';
import { CreateChatbotInput } from './dto/create-chatbot.input';
import { UpdateChatbotInput } from './dto/update-chatbot.input';
import { Chatbot } from './entities/chatbot.entity';

@Injectable()
export class ChatbotService {
  private readonly chatbots: Record<string, Socket[]> = {};
  private readonly chatbotsUrl: string;

  constructor(configService: ConfigService) {
    this.chatbotsUrl = configService.get<string>('CHATBOTS_URL');
  }

  async create(
    authorization: string,
    input: CreateChatbotInput,
  ): Promise<Chatbot> {
    try {
      const res = await axios.post<any>(
        this.chatbotsUrl.concat('/chatbots'),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.data);
    }
  }

  async findAll(authorization: string): Promise<Chatbot[]> {
    try {
      const res = await axios.get<any[]>(this.chatbotsUrl.concat('/chatbots'), {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.data);
    }
  }

  async findOne(authorization: string, id: number): Promise<Chatbot> {
    try {
      const res = await axios.get<any>(
        this.chatbotsUrl.concat(`/chatbots/${id}`),
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.data);
    }
  }

  async update(
    authorization: string,
    input: UpdateChatbotInput,
  ): Promise<Chatbot> {
    try {
      const res = await axios.patch<any>(
        this.chatbotsUrl.concat(`/chatbots/${input.id}`),
        input,
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.data);
    }
  }

  async remove(authorization: string, id: number): Promise<Chatbot> {
    try {
      const res = await axios.delete<any>(
        this.chatbotsUrl.concat(`/chatbots/${id}`),
        {
          headers: {
            authorization,
          },
        },
      );

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.request.data);
    }
  }

  handleConnection(token: string, socket: Socket): void {
    return;
  }

  handleDisconnect(token: string, socket: Socket): void {
    return;
  }
}
