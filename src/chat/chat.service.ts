import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { ChannelService } from 'src/channel/channel.service';
import { ChannelType } from 'src/channel/enums/channel-type.enum';
import { ChatbotEventType } from 'src/chatbot/enums/chatbot-event-type.enum';
import { ContactService } from 'src/contact/contact.service';
import { ProjectTokenService } from 'src/project/project-token.service';
import { pubSub } from 'src/pubsub';
import { MESSAGING_SERVICE } from 'src/shared/constants/broker';
import { CreateChatArgs } from './dto/create-chat.args';
import { FindAllChatsForUserArgs } from './dto/find-chats.args';
import { UpdateChatArgs } from './dto/update-chat.args';
import { Chat } from './entities/chat.entity';
import { ChatsCount } from './entities/chats-count.entity';

@Injectable()
export class ChatService {
  constructor(
    @Inject(MESSAGING_SERVICE) private readonly client: ClientProxy,
    @Inject(forwardRef(() => ContactService))
    private readonly contactService: ContactService,
    @Inject(forwardRef(() => ChannelService))
    private readonly channelService: ChannelService,
    private readonly projectTokenService: ProjectTokenService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    authorization: string,
    createChatArgs: CreateChatArgs,
  ): Promise<Chat> {
    const contact = await this.contactService.findOne(
      authorization,
      createChatArgs.contactId,
    );

    const channel = await lastValueFrom(
      this.channelService.findOne(authorization, createChatArgs.channelId),
    );

    const accountId = {
      [ChannelType.Telegram]: contact.telegramId,
      [ChannelType.Webchat]: contact.webchatId,
      [ChannelType.Whatsapp]: contact.whatsappId,
    }[channel.type];

    const chat = await lastValueFrom(
      this.client.send<Omit<Chat, 'contact'>>('chats.create', {
        headers: {
          authorization,
        },
        payload: {
          channelId: createChatArgs.channelId,
          accountId,
          name: contact.name,
          avatarUrl: contact.avatarUrl,
        },
      }),
    );

    await lastValueFrom(
      this.contactService.createChatForContact(
        authorization,
        createChatArgs.contactId,
        chat.id,
      ),
    );

    return {
      ...chat,
      contact,
    };
  }

  async findAll(
    authorization: string,
    args: FindAllChatsForUserArgs,
  ): Promise<Chat[]> {
    const contacts = await this.contactService.findAllForUser(
      authorization,
      args,
    );

    if (contacts.length === 0) {
      return [];
    }

    const chatIds = contacts.map(({ chats }) => chats[0].id);
    const chats = await lastValueFrom(
      this.client.send<Array<Omit<Chat, 'contact'>>>('chats.findAll', {
        headers: {
          authorization,
        },
        payload: {
          ids: chatIds,
        },
      }),
    );

    return chats
      .sort((a, b) => chatIds.indexOf(a.id) - chatIds.indexOf(b.id))
      .map((chat) => ({
        ...chat,
        contact: contacts.find(({ chats }) => chats[0].id === chat.id),
      }));
  }

  async findWithQuery(authorization: string, query: string): Promise<Chat[]> {
    throw new NotImplementedException();
  }

  async findOne(authorization: string, id: number): Promise<Chat> {
    const [contact] = await this.contactService.findOneForChat(
      authorization,
      id,
    );

    if (!contact) {
      throw new NotFoundException();
    }

    const chat = await lastValueFrom(
      this.client.send<Omit<Chat, 'contact'>>('chats.findOne', {
        headers: {
          authorization,
        },
        payload: id,
      }),
    );

    return {
      ...chat,
      contact,
    };
  }

  update(
    authorization: string,
    input: UpdateChatArgs,
  ): Observable<Omit<Chat, 'contact'>> {
    return this.client.send<Omit<Chat, 'contact'>>('chats.update', {
      headers: {
        authorization,
      },
      payload: input,
    });
  }

  remove(authorization: string, id: number): Observable<Omit<Chat, 'contact'>> {
    return this.client.send<Omit<Chat, 'contact'>>('chats.remove', {
      headers: {
        authorization,
      },
      payload: id,
    });
  }

  countAll(authorization: string): Observable<ChatsCount> {
    return this.contactService.countAll(authorization);
  }

  async received(projectId: number, chat: any): Promise<void> {
    const contact = await this.contactService.createForChat(
      `Bearer ${await this.projectTokenService
        .get(projectId)
        .then(({ token }) => token)}`,
      chat.id,
      chat.contact,
    );

    this.eventEmitter.emit(ChatbotEventType.NewChat, projectId, {
      ...chat,
      contact,
    });

    pubSub.publish(`chatsReceived:${projectId}`, {
      chatsReceived: {
        ...chat,
        contact,
      },
    });
  }
}
