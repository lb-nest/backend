import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { EventEmitter } from 'events';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { Auth } from 'src/auth/interfaces/auth.interface';
import { ContactService } from 'src/contact/contact.service';
import { MessageService } from 'src/message/message.service';
import { CHATBOTS_SERVICE } from 'src/shared/constants/broker';
import { CreateChatbotArgs } from './dto/create-chatbot.args';
import { HandleCallbackDto } from './dto/handle-callback.dto';
import { HandleCreateMessageDto } from './dto/handle-create-message.dto';
import { HandleUpdateContactDto } from './dto/handle-update-contact.dto';
import { HandleWebhookDto } from './dto/handle-webhook.dto';
import { UpdateChatbotArgs } from './dto/update-chatbot.args';
import { Chatbot } from './entities/chatbot.entity';
import { ChatbotEventType } from './enums/chatbot-event-type.enum';

@Injectable()
export class ChatbotService {
  private readonly emitter = new EventEmitter();
  private readonly sockets = new WeakMap<
    Socket,
    [Required<Auth>, Socket['emit']]
  >();

  constructor(
    @Inject(CHATBOTS_SERVICE) private readonly client: ClientProxy,
    private readonly configService: ConfigService,
    private readonly contactService: ContactService,
    private readonly messageService: MessageService,
  ) {
    this.emitter.setMaxListeners(Infinity);
  }

  create(
    projectId: number,
    createChatbotArgs: CreateChatbotArgs,
  ): Observable<Chatbot> {
    return this.client.send<Chatbot>('createChatbot', {
      projectId,
      ...createChatbotArgs,
    });
  }

  findAll(projectId: number): Observable<Chatbot[]> {
    return this.client.send<Chatbot[]>('findAllChatbots', {
      projectId,
    });
  }

  findOne(projectId: number, id: number): Observable<Chatbot> {
    return this.client.send<Chatbot>('findOneChatbot', {
      projectId,
      id,
    });
  }

  update(
    projectId: number,
    updateChatbotArgs: UpdateChatbotArgs,
  ): Observable<Chatbot> {
    return this.client.send<Chatbot>('updateChatbot', {
      projectId,
      ...updateChatbotArgs,
    });
  }

  remove(projectId: number, id: number): Observable<Chatbot> {
    return this.client.send<Chatbot>('removeChatbot', {
      projectId,
      id,
    });
  }

  handleConnection(socket: Socket): void {
    try {
      const auth = verify(
        socket.handshake.auth.token,
        this.configService.get<string>('SECRET'),
      ) as Required<Auth>;

      const emit = socket.emit.bind(socket);
      this.emitter.on(auth.project.id.toString(), emit);
      this.sockets.set(socket, [auth, emit]);
    } catch {}
  }

  handleDisconnect(socket: Socket): void {
    try {
      const [auth, emit] = this.sockets.get(socket);
      this.emitter.off(auth.project.id.toString(), emit);
      this.sockets.delete(socket);
    } catch {}
  }

  emit(event: any): void {
    this.emitter.emit(event.projectId, event.type, event);
  }

  handleCallback(socket: Socket, handleCallbackDto: HandleCallbackDto): void {
    socket.emit(ChatbotEventType.Callback, {
      id: handleCallbackDto.contactId,
    });
  }

  async handleCreateMessage(
    socket: Socket,
    handleCreateMessageDto: HandleCreateMessageDto,
  ): Promise<void> {
    const [auth] = this.sockets.get(socket);
    await this.messageService.create(auth.project.id, handleCreateMessageDto);

    socket.emit(ChatbotEventType.Callback, {
      id: handleCreateMessageDto.contactId,
    });
  }

  async handleUpdateContact(
    socket: Socket,
    handleUpdateContactDto: HandleUpdateContactDto,
  ): Promise<void> {
    const [auth] = this.sockets.get(socket);
    await this.contactService.update(auth.project.id, handleUpdateContactDto);

    socket.emit(ChatbotEventType.Callback, {
      id: handleUpdateContactDto.id,
    });
  }

  handleWebhook(token: string, handleWebhookDto: HandleWebhookDto): void {
    try {
      const auth = verify(
        token,
        this.configService.get<string>('SECRET'),
      ) as Required<Auth>;

      // TODO: create contact with chat
      const chat = {
        contact: {},
      };

      this.emit({
        projectId: auth.project.id,
        type: ChatbotEventType.NewChat,
        ...chat,
        contact: chat.contact,
      });
    } catch {}
  }
}
