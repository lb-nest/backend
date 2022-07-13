import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { EventEmitter } from 'events';
import { JwtPayload, verify } from 'jsonwebtoken';
import { lastValueFrom } from 'rxjs';
import { Socket } from 'socket.io';
import { CreateChatbotInput } from './dto/create-chatbot.input';
import { UpdateChatbotInput } from './dto/update-chatbot.input';
import { Chatbot } from './entities/chatbot.entity';
import { ChatbotEventType } from './enums/chatbot-event-type.enum';

@Injectable()
export class ChatbotService {
  private readonly emitter = new EventEmitter();
  private readonly sockets = new WeakMap<Socket, [string, Socket['emit']]>();

  constructor(
    private readonly configService: ConfigService,
    @Inject('CHATBOTS') private readonly client: ClientProxy,
  ) {
    this.emitter.setMaxListeners(Infinity);
  }

  async create(user: any, input: CreateChatbotInput): Promise<Chatbot> {
    try {
      return await lastValueFrom(
        this.client.send<Chatbot>('chatbots.create', {
          user,
          data: input,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll(user: any): Promise<Chatbot[]> {
    try {
      return await lastValueFrom(
        this.client.send<Chatbot[]>('chatbots.findAll', {
          user,
          data: {},
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findOne(user: any, id: number): Promise<Chatbot> {
    try {
      return await lastValueFrom(
        this.client.send<Chatbot>('chatbots.findOne', {
          user,
          data: id,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async update(user: any, input: UpdateChatbotInput): Promise<Chatbot> {
    try {
      return await lastValueFrom(
        this.client.send<Chatbot>('chatbots.update', {
          user,
          data: input,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(user: any, id: number): Promise<Chatbot> {
    try {
      return await lastValueFrom(
        this.client.send('chatbots.remove', {
          user,
          data: id,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  handleConnection(socket: Socket): void {
    const { auth } = socket.handshake;
    try {
      const token = <JwtPayload>(
        verify(auth.token, this.configService.get<string>('SECRET'))
      );

      this.sockets.set(socket, [token.project.id, socket.emit.bind(socket)]);
      this.emitter.on(...this.sockets.get(socket));
    } catch (e) {
      console.error(e);
    }
  }

  handleDisconnect(socket: Socket): void {
    this.emitter.off(...this.sockets.get(socket));
    this.sockets.delete(socket);
  }

  emit(projectId: number, event: any): void {
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
