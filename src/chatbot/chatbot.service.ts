import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { EventEmitter } from 'events';
import { JwtPayload, verify } from 'jsonwebtoken';
import { lastValueFrom, Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { ContactFlowService } from 'src/contact/contact-flow.service';
import { ContactTagService } from 'src/contact/contact-tag.service';
import { MessageService } from 'src/message/message.service';
import { ProjectTokenService } from 'src/project/project-token.service';
import { CHATBOTS_SERVICE } from 'src/shared/constants/broker';
import { CreateChatbotArgs } from './dto/create-chatbot.args';
import { HandleAssignTagDto } from './dto/handle-assign-tag.dto';
import { HandleCallbackDto } from './dto/handle-callback.dto';
import { HandleCloseDto } from './dto/handle-close.dto';
import { HandleSendMessageDto } from './dto/handle-send-message.dto';
import { HandleTransferDto } from './dto/handle-transfer.dto';
import { HandleWebhookDto } from './dto/handle-webhook.dto';
import { UpdateChatbotArgs } from './dto/update-chatbot.args';
import { Chatbot } from './entities/chatbot.entity';
import { ChatbotEventType } from './enums/chatbot-event-type.enum';

@Injectable()
export class ChatbotService {
  private readonly emitter = new EventEmitter();
  private readonly sockets = new WeakMap<Socket, [any, Socket['emit']]>();

  constructor(
    @Inject(CHATBOTS_SERVICE) private readonly client: ClientProxy,
    private readonly configService: ConfigService,
    private readonly projectTokenService: ProjectTokenService,
    private readonly messageService: MessageService,
    private readonly contactFlowService: ContactFlowService,
    private readonly contactTagService: ContactTagService,
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
      const jwt = verify(
        socket.handshake.auth.token,
        this.configService.get<string>('SECRET'),
      ) as JwtPayload;

      this.sockets.set(socket, [jwt.project.id, socket.emit.bind(socket)]);
      this.emitter.on(...this.sockets.get(socket));
    } catch {}
  }

  handleDisconnect(socket: Socket): void {
    this.emitter.off(...this.sockets.get(socket));
    this.sockets.delete(socket);
  }

  emit(event: any): void {
    this.emitter.emit(event.projectId, event.type, event);
  }

  async handleSendMessage(
    socket: Socket,
    handleSendMessageDto: HandleSendMessageDto,
  ): Promise<void> {
    await this.messageService.create(
      await this.authorize(socket),
      handleSendMessageDto,
    );

    socket.emit(ChatbotEventType.Callback, {
      id: handleSendMessageDto.chatId,
    });
  }

  handleCallback(socket: Socket, handleCallbackDto: HandleCallbackDto): void {
    socket.emit(ChatbotEventType.Callback, {
      id: handleCallbackDto.chatId,
    });
  }

  async handleTransfer(
    socket: Socket,
    handleTransferDto: HandleTransferDto,
  ): Promise<void> {
    await this.contactFlowService.transfer(
      await this.authorize(socket),
      handleTransferDto,
    );

    socket.emit(ChatbotEventType.Callback, {
      id: handleTransferDto.chatId,
    });
  }

  async handleAssignTag(
    socket: Socket,
    handleAssignTagDto: HandleAssignTagDto,
  ): Promise<void> {
    await lastValueFrom(
      this.contactTagService.create(
        await this.authorize(socket),
        handleAssignTagDto.id,
        handleAssignTagDto.tagId,
      ),
    );

    socket.emit(ChatbotEventType.Callback, {
      id: handleAssignTagDto.chatId,
    });
  }

  async handleClose(
    socket: Socket,
    handleCloseDto: HandleCloseDto,
  ): Promise<void> {
    await this.contactFlowService.close(
      await this.authorize(socket),
      handleCloseDto.id,
    );

    socket.emit(ChatbotEventType.Callback, {
      id: handleCloseDto.chatId,
    });
  }

  handleWebhook(token: string, handleWebhookDto: HandleWebhookDto): void {
    try {
      const jwt = verify(
        token,
        this.configService.get<string>('SECRET'),
      ) as JwtPayload;

      // TODO: create contact with chat
      const chat = {
        contact: {},
      };

      this.emit({
        projectId: jwt.project.id,
        type: ChatbotEventType.NewChat,
        ...chat,
        contact: chat.contact,
      });
    } catch {}
  }

  private async authorize(socket: Socket): Promise<string> {
    const [projectId] = this.sockets.get(socket);
    const { token } = await this.projectTokenService.get(projectId);
    return `Bearer ${token}`;
  }
}
