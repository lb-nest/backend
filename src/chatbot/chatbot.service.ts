import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { EventEmitter } from 'events';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { CHATBOTS_SERVICE } from 'src/shared/constants/broker';
import { CreateChatbotArgs } from './dto/create-chatbot.args';
import { UpdateChatbotArgs } from './dto/update-chatbot.args';
import { Chatbot } from './entities/chatbot.entity';
import { ChatbotEventType } from './enums/chatbot-event-type.enum';

@Injectable()
export class ChatbotService {
  private readonly emitter = new EventEmitter();
  private readonly sockets = new WeakMap<Socket, [string, Socket['emit']]>();

  constructor(
    @Inject(CHATBOTS_SERVICE) private readonly client: ClientProxy,
    private readonly configService: ConfigService,
  ) {
    this.emitter.setMaxListeners(Infinity);
  }

  create(
    authorization: string,
    createChatbotArgs: CreateChatbotArgs,
  ): Observable<Chatbot> {
    return this.client.send<Chatbot>('chatbots.create', {
      headers: {
        authorization,
      },
      payload: createChatbotArgs,
    });
  }

  findAll(authorization: string): Observable<Chatbot[]> {
    return this.client.send<Chatbot[]>('chatbots.findAll', {
      headers: {
        authorization,
      },
      payload: null,
    });
  }

  findOne(authorization: string, id: number): Observable<Chatbot> {
    return this.client.send<Chatbot>('chatbots.findOne', {
      headers: {
        authorization,
      },
      payload: id,
    });
  }

  update(
    authorization: string,
    updateChatbotArgs: UpdateChatbotArgs,
  ): Observable<Chatbot> {
    return this.client.send<Chatbot>('chatbots.update', {
      headers: {
        authorization,
      },
      payload: updateChatbotArgs,
    });
  }

  remove(authorization: string, id: number): Observable<Chatbot> {
    return this.client.send<Chatbot>('chatbots.remove', {
      headers: {
        authorization,
      },
      payload: id,
    });
  }

  handleConnection(socket: Socket): void {
    try {
      const token = verify(
        socket.handshake.auth.token,
        this.configService.get<string>('SECRET'),
      ) as JwtPayload;

      this.sockets.set(socket, [token.project.id, socket.emit.bind(socket)]);
      this.emitter.on(...this.sockets.get(socket));
    } catch {}
  }

  handleDisconnect(socket: Socket): void {
    this.emitter.off(...this.sockets.get(socket));
    this.sockets.delete(socket);
  }

  emit(projectId: number, event: any): void {
    this.emitter.emit(projectId.toString(), ChatbotEventType.NewEvent, event);
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
