import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatbotService } from './chatbot.service';
import { HandleCallbackDto } from './dto/handle-callback.dto';
import { HandleCreateMessageDto } from './dto/handle-create-message.dto';
import { HandleUpdateContactDto } from './dto/handle-update-contact.dto';
import { ChatbotEventType } from './enums/chatbot-event-type.enum';

// TODO: https://stackoverflow.com/questions/69435506/how-to-pass-a-dynamic-port-to-the-websockets-gateway-in-nestjs
@WebSocketGateway(10100)
export class ChatbotGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatbotService: ChatbotService) {}

  handleConnection(socket: Socket): void {
    return this.chatbotService.handleConnection(socket);
  }

  handleDisconnect(socket: Socket): void {
    return this.chatbotService.handleDisconnect(socket);
  }

  @SubscribeMessage(ChatbotEventType.Callback)
  handleCallback(
    @ConnectedSocket() socket: Socket,
    @MessageBody() handleCallbackDto: HandleCallbackDto,
  ): void {
    return this.chatbotService.handleCallback(socket, handleCallbackDto);
  }

  @SubscribeMessage(ChatbotEventType.CreateMessage)
  handleCreateMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() handleCreateMessageDto: HandleCreateMessageDto,
  ): Promise<void> {
    return this.chatbotService.handleCreateMessage(
      socket,
      handleCreateMessageDto,
    );
  }

  @SubscribeMessage(ChatbotEventType.UpdateContact)
  handleUpdateContact(
    @ConnectedSocket() socket: Socket,
    @MessageBody() handleUpdateContactDto: HandleUpdateContactDto,
  ): Promise<void> {
    return this.chatbotService.handleUpdateContact(
      socket,
      handleUpdateContactDto,
    );
  }
}
