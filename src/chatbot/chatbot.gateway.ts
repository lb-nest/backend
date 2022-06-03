import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { EventEmitter } from 'events';
import { Socket } from 'socket.io';
import { ChatbotService } from './chatbot.service';
import { ChatbotEventType } from './enums/chatbot-event-type.enum';

// TODO: https://stackoverflow.com/questions/69435506/how-to-pass-a-dynamic-port-to-the-websockets-gateway-in-nestjs
@WebSocketGateway(9090)
export class ChatbotGateway {
  private readonly emitter = new EventEmitter();
  private readonly socket = new WeakMap<Socket, [string, Socket['emit']]>();

  constructor(private readonly chatbotService: ChatbotService) {}

  handleConnection(socket: Socket): void {
    this.chatbotService.handleConnection(socket);
  }

  handleDisconnect(socket: Socket): void {
    this.chatbotService.handleDisconnect(socket);
  }

  @SubscribeMessage(ChatbotEventType.SendMessage)
  async handleSendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
    this.chatbotService.handleSendMessage(socket, message);
  }

  @SubscribeMessage(ChatbotEventType.Callback)
  async handleCallback(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
    this.chatbotService.handleSendMessage(socket, message);
  }

  @SubscribeMessage(ChatbotEventType.Transfer)
  async handleTransfer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
    this.chatbotService.handleSendMessage(socket, message);
  }

  @SubscribeMessage(ChatbotEventType.AssignTag)
  async handleAssignTag(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
    this.chatbotService.handleSendMessage(socket, message);
  }

  @SubscribeMessage(ChatbotEventType.Close)
  async handleClose(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
    this.chatbotService.handleSendMessage(socket, message);
  }
}
