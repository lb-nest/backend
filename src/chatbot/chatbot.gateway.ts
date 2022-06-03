import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { decode, JwtPayload, verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { ChatbotEventType } from './enums/chatbot-event-type.enum';

// TODO: https://stackoverflow.com/questions/69435506/how-to-pass-a-dynamic-port-to-the-websockets-gateway-in-nestjs
@WebSocketGateway(9090)
export class ChatbotGateway {
  private readonly socket: Record<string, Socket[]> = {};

  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  handleConnection(socket: Socket): void {
    const { auth } = socket.handshake;
    try {
      const token = <JwtPayload>(
        verify(auth.token, this.configService.get<string>('SECRET'))
      );

      if (!this.socket[token.project.id]) {
        this.socket[token.project.id] = [];
      }

      this.socket[token.project.id].push(socket);
    } catch (e) {
      console.error(e);
    }
  }

  handleDisconnect(socket: Socket): void {
    const { auth } = socket.handshake;
    try {
      const token = <JwtPayload>decode(auth.token);
      const index = this.socket[token.project.id].findIndex(
        (value) => value === socket,
      );

      if (~index) {
        this.socket[token.project.id].splice(index, 1);
      }
    } catch (e) {
      console.error(e);
    }
  }

  emit(projectId: number, event: ChatbotEventType, data: any): void {
    this.socket[projectId]?.map((socket) => {
      socket.emit(event, data);
    });
  }

  @SubscribeMessage(ChatbotEventType.SendMessage)
  async handleSendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    this.eventEmitter.emit(ChatbotEventType.SendMessage, body);
    socket.emit(ChatbotEventType.Callback, {
      id: body.chatId,
    });
  }

  @SubscribeMessage(ChatbotEventType.Transfer)
  async handleTransfer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    this.eventEmitter.emit(ChatbotEventType.Transfer, body);
    socket.emit(ChatbotEventType.Callback, {
      id: body.chatId,
    });
  }

  @SubscribeMessage(ChatbotEventType.AssignTag)
  async handleAssignTag(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    this.eventEmitter.emit(ChatbotEventType.AssignTag, body);
    socket.emit(ChatbotEventType.Callback, {
      id: body.chatId,
    });
  }

  @SubscribeMessage(ChatbotEventType.Close)
  async handleClose(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    this.eventEmitter.emit(ChatbotEventType.Close, body);
    socket.emit(ChatbotEventType.Callback, {
      id: body.chatId,
    });
  }

  @SubscribeMessage(ChatbotEventType.Callback)
  async handleCallback(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    socket.emit(ChatbotEventType.Callback, {
      id: body.chatId,
    });
  }
}
