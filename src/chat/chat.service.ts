import {
  Inject,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { ChatbotEventType } from 'src/chatbot/enums/chatbot-event-type.enum';
import { ContactAssignedToService } from 'src/contact/contact-assigned-to.service';
import { ContactChatService } from 'src/contact/contact-chat.service';
import { pubSub } from 'src/pubsub';
import { MESSAGING_SERVICE } from 'src/shared/constants/broker';
import { CreateChatArgs } from './dto/create-chat.args';
import { FindAllChatsWithQueryArgs } from './dto/find-all-chats-with-query.args';
import { FindAllChatsArgs } from './dto/find-all-chats.args';
import { Chat } from './entities/chat.entity';
import { ChatsCount } from './entities/chats-count.entity';

@Injectable()
export class ChatService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Inject(MESSAGING_SERVICE) private readonly client: ClientProxy,
    private readonly contactAssignedToService: ContactAssignedToService,
    private readonly contactChatService: ContactChatService,
  ) {}

  async create(
    projectId: number,
    createChatArgs: CreateChatArgs,
  ): Promise<Chat> {
    const chat = await lastValueFrom(
      this.client.send<any>('createChat', {
        projectId,
        channelId: createChatArgs.channelId,
        accountId: createChatArgs.accountId,
      }),
    );

    const contact = await this.contactChatService.createChatFor(
      projectId,
      createChatArgs.contactId,
      createChatArgs.channelId,
      createChatArgs.accountId,
    );

    return {
      ...chat,
      contact,
    };
  }

  async findAll(
    projectId: number,
    findAllChatsArgs: FindAllChatsArgs,
  ): Promise<Chat[]> {
    const contacts = await this.contactAssignedToService.findAll(
      projectId,
      findAllChatsArgs,
    );

    if (contacts.length === 0) {
      return [];
    }

    const chats = await lastValueFrom(
      this.client.send<Array<Omit<Chat, 'contact'>>>('findAllChats', {
        projectId,
        accountIds: contacts
          .map(({ chats }) => chats[0]?.accountId)
          .filter(Boolean),
      }),
    );

    return chats.map((chat) => ({
      ...chat,
      contact: contacts.find(
        ({ chats }) => chats[0].accountId === chat.accountId,
      ),
    }));
  }

  async findAllWithQuery(
    projectId: number,
    findAllChatsWithQueryArgs: FindAllChatsWithQueryArgs,
  ): Promise<Chat[]> {
    throw new NotImplementedException();
  }

  async findOne(
    projectId: number,
    channelId: number,
    accountId: string,
  ): Promise<Chat> {
    const contact = await this.contactChatService.findOne(
      projectId,
      channelId,
      accountId,
    );

    if (!contact) {
      throw new NotFoundException();
    }

    const chat = await lastValueFrom(
      this.client.send<Omit<Chat, 'contact'>>('findOneChat', {
        projectId,
        channelId,
        accountId,
      }),
    );

    return {
      ...chat,
      contact,
    };
  }

  remove(
    projectId: number,
    channelId: number,
    accountId: string,
  ): Observable<Omit<Chat, 'contact'>> {
    return this.client.send<Omit<Chat, 'contact'>>('removeChat', {
      projectId,
      channelId,
      accountId,
    });
  }

  countAll(projectId: number, id: number): Observable<ChatsCount> {
    return this.contactAssignedToService.countAll(projectId, id);
  }

  async received(projectId: number, chat: any): Promise<void> {
    const contact = await this.contactChatService.createForChat(
      projectId,
      chat.channelId,
      chat.accountId,
      chat.contact,
    );

    this.eventEmitter.emit(ChatbotEventType.NewChat, projectId, {
      ...chat,
      contact,
    });

    pubSub.publish(`chatReceived:${projectId}`, {
      chatReceived: {
        ...chat,
        contact,
      },
    });
  }
}
