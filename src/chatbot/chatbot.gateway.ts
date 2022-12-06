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
import { HandleAssignTagDto } from './dto/handle-assign-tag.dto';
import { HandleCallbackDto } from './dto/handle-callback.dto';
import { HandleCloseDto } from './dto/handle-close.dto';
import { HandleSendMessageDto } from './dto/handle-send-message.dto';
import { HandleTransferDto } from './dto/handle-transfer.dto';
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

  @SubscribeMessage(ChatbotEventType.SendMessage)
  handleSendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() handleSendMessageDto: HandleSendMessageDto,
  ): Promise<void> {
    return this.chatbotService.handleSendMessage(socket, handleSendMessageDto);
  }

  @SubscribeMessage(ChatbotEventType.Callback)
  handleCallback(
    @ConnectedSocket() socket: Socket,
    @MessageBody() handleCallbackDto: HandleCallbackDto,
  ): void {
    return this.chatbotService.handleCallback(socket, handleCallbackDto);
  }

  @SubscribeMessage(ChatbotEventType.Transfer)
  handleTransfer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() handleTransferDto: HandleTransferDto,
  ): Promise<void> {
    return this.chatbotService.handleTransfer(socket, handleTransferDto);
  }

  @SubscribeMessage(ChatbotEventType.AssignTag)
  handleAssignTag(
    @ConnectedSocket() socket: Socket,
    @MessageBody() handleAssignTagDto: HandleAssignTagDto,
  ): Promise<void> {
    return this.chatbotService.handleAssignTag(socket, handleAssignTagDto);
  }

  @SubscribeMessage(ChatbotEventType.Close)
  handleClose(
    @ConnectedSocket() socket: Socket,
    @MessageBody() handleCloseDto: HandleCloseDto,
  ): Promise<void> {
    return this.chatbotService.handleClose(socket, handleCloseDto);
  }
}
