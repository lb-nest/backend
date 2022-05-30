import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { CreateChatbotInput } from './dto/create-chatbot.input';
import { UpdateChatbotInput } from './dto/update-chatbot.input';
import { Chatbot } from './entities/chatbot.entity';

@Injectable()
export class ChatbotService {
  private readonly chatbots: Record<string, any[]> = {};
  private readonly axios: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.axios = axios.create({
      baseURL: configService.get<string>('CHATBOTS_URL'),
    });
  }

  async create(
    authorization: string,
    input: CreateChatbotInput,
  ): Promise<Chatbot> {
    try {
      const res = await this.axios.post<any>('/chatbots', input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async findAll(authorization: string): Promise<Chatbot[]> {
    try {
      const res = await this.axios.get<any[]>('/chatbots', {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async findOne(authorization: string, id: number): Promise<Chatbot> {
    try {
      const res = await this.axios.get<any>(`/chatbots/${id}`, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async update(
    authorization: string,
    input: UpdateChatbotInput,
  ): Promise<Chatbot> {
    try {
      const res = await this.axios.patch<any>(`/chatbots/${input.id}`, input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async remove(authorization: string, id: number): Promise<Chatbot> {
    try {
      const res = await this.axios.delete<any>(`/chatbots/${id}`, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  handleConnection(init: Record<string, any>, socket: Socket): void {
    const payload = <JwtPayload>(
      verify(init.token, this.configService.get<string>('SECRET'))
    );

    if (!this.chatbots[payload.project.id]) {
      this.chatbots[payload.project.id] = [];
    }

    this.chatbots[payload.project.id].push({
      socket,
      trigger: init.trigger,
    });
  }

  handleDisconnect(init: Record<string, any>, socket: Socket): void {
    const payload = <JwtPayload>(
      verify(init.token, this.configService.get<string>('SECRET'))
    );

    const index = this.chatbots[payload.project.id].findIndex(
      (chatbot) => chatbot.socket === socket,
    );

    if (~index) {
      this.chatbots[payload.project.id].splice(index, 1);
    }
  }
}
