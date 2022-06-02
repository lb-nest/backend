import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { JwtPayload, verify } from 'jsonwebtoken';
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

  async handleConnection(socket: Socket) {
    const init = socket.handshake.auth;
    try {
      const payload = <JwtPayload>(
        verify(init.token, this.configService.get<string>('SECRET'))
      );

      if (!this.socket[payload.project.id]) {
        this.socket[payload.project.id] = [];
      }

      this.socket[payload.project.id].push(socket);
    } catch {}
  }

  async handleDisconnect(socket: Socket) {
    const init = socket.handshake.auth;
    try {
      const payload = <JwtPayload>(
        verify(init.token, this.configService.get<string>('SECRET'))
      );

      const index = this.socket[payload.project.id].findIndex(
        (value) => value === socket,
      );

      if (~index) {
        this.socket[payload.project.id].splice(index, 1);
      }
    } catch {}
  }

  emit(projectId: number, event: ChatbotEventType, data: any): void {
    this.socket[projectId].map((socket) => {
      socket.emit(event, data);
    });
  }

  @SubscribeMessage(ChatbotEventType.SendMessage)
  async handleSendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    this.eventEmitter.emit(ChatbotEventType.SendMessage, body);
  }

  @SubscribeMessage(ChatbotEventType.AssignTag)
  async handleAssignTag(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    this.eventEmitter.emit(ChatbotEventType.AssignTag, body);
  }

  @SubscribeMessage(ChatbotEventType.Transfer)
  async handleTransferContact(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    this.eventEmitter.emit(ChatbotEventType.Transfer, body);
  }

  @SubscribeMessage(ChatbotEventType.Close)
  async handleCloseContact(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    this.eventEmitter.emit(ChatbotEventType.Close, body);
  }

  @SubscribeMessage(ChatbotEventType.Callback)
  async handleCallback(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    socket.emit(ChatbotEventType.Callback, body);
  }
}
