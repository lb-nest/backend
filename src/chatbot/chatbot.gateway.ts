import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatbotService } from './chatbot.service';
import { ChatbotEventType } from './enums/chatbot-event-type.enum';

// TODO: https://stackoverflow.com/questions/69435506/how-to-pass-a-dynamic-port-to-the-websockets-gateway-in-nestjs
@WebSocketGateway(10100)
export class ChatbotGateway {
  constructor(private readonly chatbotService: ChatbotService) {}

  handleConnection(socket: Socket): void {
    return this.chatbotService.handleConnection(socket);
  }

  handleDisconnect(socket: Socket): void {
    return this.chatbotService.handleDisconnect(socket);
  }

  @SubscribeMessage(ChatbotEventType.SendMessage)
  handleSendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ): void {
    return this.chatbotService.handleSendMessage(socket, message);
  }

  @SubscribeMessage(ChatbotEventType.Callback)
  handleCallback(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ): void {
    return this.chatbotService.handleSendMessage(socket, message);
  }

  @SubscribeMessage(ChatbotEventType.Transfer)
  handleTransfer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ): void {
    return this.chatbotService.handleSendMessage(socket, message);
  }

  @SubscribeMessage(ChatbotEventType.AssignTag)
  handleAssignTag(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ): void {
    return this.chatbotService.handleSendMessage(socket, message);
  }

  @SubscribeMessage(ChatbotEventType.Close)
  handleClose(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ): void {
    return this.chatbotService.handleSendMessage(socket, message);
  }
}
