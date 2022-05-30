import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatbotService } from './chatbot.service';

// TODO: https://stackoverflow.com/questions/69435506/how-to-pass-a-dynamic-port-to-the-websockets-gateway-in-nestjs
@WebSocketGateway(9090)
export class ChatbotGateway {
  constructor(private readonly chatbotService: ChatbotService) {}

  async handleConnection(socket: Socket) {
    this.chatbotService.handleConnection(socket.handshake.auth.token, socket);
  }

  async handleDisconnect(socket: Socket) {
    this.chatbotService.handleDisconnect(socket.handshake.auth.token, socket);
  }

  @SubscribeMessage('event')
  async handle(@ConnectedSocket() socket: Socket, @MessageBody() message: any) {
    socket.emit('event', 'data');
  }
}
