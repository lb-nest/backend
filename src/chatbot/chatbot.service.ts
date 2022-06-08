import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { EventEmitter } from 'events';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { CreateChatbotInput } from './dto/create-chatbot.input';
import { UpdateChatbotInput } from './dto/update-chatbot.input';
import { Chatbot } from './entities/chatbot.entity';
import { ChatbotEventType } from './enums/chatbot-event-type.enum';

@Injectable()
export class ChatbotService {
  private readonly emitter = new EventEmitter();
  private readonly socket = new WeakMap<Socket, [string, Socket['emit']]>();

  private readonly axios: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.axios = axios.create({
      baseURL: configService.get<string>('CHATBOTS_URL'),
    });

    this.emitter.setMaxListeners(Infinity);
  }

  async create(
    authorization: string,
    input: CreateChatbotInput,
  ): Promise<Chatbot> {
    try {
      const res = await this.axios.post<Chatbot>('/chatbots', input, {
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
      const res = await this.axios.get<Chatbot[]>('/chatbots', {
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
      const res = await this.axios.get<Chatbot>(`/chatbots/${id}`, {
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
      const res = await this.axios.patch<Chatbot>(
        `/chatbots/${input.id}`,
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

  async remove(authorization: string, id: number): Promise<Chatbot> {
    try {
      const res = await this.axios.delete<Chatbot>(`/chatbots/${id}`, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  handleConnection(socket: Socket): void {
    const { auth } = socket.handshake;
    try {
      const token = <JwtPayload>(
        verify(auth.token, this.configService.get<string>('SECRET'))
      );

      this.socket.set(socket, [token.project.id, socket.emit.bind(socket)]);
      this.emitter.on(...this.socket.get(socket));
    } catch (e) {
      console.error(e);
    }
  }

  handleDisconnect(socket: Socket): void {
    this.emitter.off(...this.socket.get(socket));
    this.socket.delete(socket);
  }

  sendNewEvent(projectId: number, event: any): void {
    this.emitter.emit(String(projectId), ChatbotEventType.NewEvent, event);
  }

  handleSendMessage(socket: Socket, message: any): void {
    // TODO: call messageService.create
    socket.emit(ChatbotEventType.Callback, {
      id: message.chatId,
    });
  }

  handleCallback(socket: Socket, message: any): void {
    socket.emit(ChatbotEventType.Callback, {
      id: message.chatId,
    });
  }

  handleTransfer(socket: Socket, message: any): void {
    // TODO: call contactFlowService.transfer
    socket.emit(ChatbotEventType.Callback, {
      id: message.chatId,
    });
  }

  handleAssignTag(socket: Socket, message: any): void {
    // TODO: call contactTagService.create
    socket.emit(ChatbotEventType.Callback, {
      id: message.chatId,
    });
  }

  handleClose(socket: Socket, message: any): void {
    // TODO: call contactFlowService.close
    socket.emit(ChatbotEventType.Callback, {
      id: message.chatId,
    });
  }
}
