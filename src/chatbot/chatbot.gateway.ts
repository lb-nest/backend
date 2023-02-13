import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Contact } from 'src/contact/entities/contact.entity';
import { Message } from 'src/message/entities/message.entity';
import { ChatbotService } from './chatbot.service';
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

  @SubscribeMessage(ChatbotEventType.CreateMessage)
  handleCreateMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() handleCreateMessageDto: HandleCreateMessageDto,
  ): Promise<Message[]> {
    return this.chatbotService.handleCreateMessage(
      socket,
      handleCreateMessageDto,
    );
  }

  @SubscribeMessage(ChatbotEventType.UpdateContact)
  handleUpdateContact(
    @ConnectedSocket() socket: Socket,
    @MessageBody() handleUpdateContactDto: HandleUpdateContactDto,
  ): Promise<Contact> {
    return this.chatbotService.handleUpdateContact(
      socket,
      handleUpdateContactDto,
    );
  }
}
