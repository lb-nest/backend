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
  private readonly chatbots: Record<string, any[]> = {};

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

      if (!this.chatbots[payload.project.id]) {
        this.chatbots[payload.project.id] = [];
      }

      this.chatbots[payload.project.id].push({
        socket,
        trigger: init.trigger,
      });
    } catch {}
  }

  async handleDisconnect(socket: Socket) {
    const init = socket.handshake.auth;
    try {
      const payload = <JwtPayload>(
        verify(init.token, this.configService.get<string>('SECRET'))
      );

      const index = this.chatbots[payload.project.id].findIndex(
        (chatbot) => chatbot.socket === socket,
      );

      if (~index) {
        this.chatbots[payload.project.id].splice(index, 1);
      }
    } catch {}
  }

  emit(projectId: number, event: ChatbotEventType, data: any): void {
    this.chatbots[projectId].map((chatbot) => {
      chatbot.socket.emit(event, data);
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

  @SubscribeMessage(ChatbotEventType.TransferContact)
  async handleTransferContact(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    this.eventEmitter.emit(ChatbotEventType.TransferContact, body);
  }

  @SubscribeMessage(ChatbotEventType.CloseContact)
  async handleCloseContact(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    this.eventEmitter.emit(ChatbotEventType.CloseContact, body);
  }

  @SubscribeMessage(ChatbotEventType.Callback)
  async handleCallback(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    socket.emit(ChatbotEventType.Callback, body);
  }
}
