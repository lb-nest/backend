import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ProjectService } from 'src/project/project.service';
import { ChatsInput } from './dto/chats.input';
import { CreateChatInput } from './dto/create-chat.input';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @Inject('CONTACTS') private readonly contactsClient: ClientProxy,
    @Inject('MESSAGING') private readonly messagingClient: ClientProxy,
    private readonly projectService: ProjectService,
  ) {}

  async create(user: any, input: CreateChatInput): Promise<Chat> {
    throw new NotImplementedException();
  }

  async findAll(user: any, input: ChatsInput): Promise<Chat[]> {
    try {
      const contacts = await lastValueFrom(
        this.contactsClient.send<any[]>('contacts.findAll', {
          user,
          data: input,
        }),
      );

      const chatIds = contacts.map(({ chatId }) => chatId);

      const chats = await lastValueFrom(
        this.messagingClient.send<any[]>('chats.findAll', {
          user,
          data: chatIds,
        }),
      );

      const assignedTo = contacts.map((c) => c.assignedTo).filter(Boolean);
      if (assignedTo.length > 0) {
        const users = await this.projectService.findAllUsers(
          user,
          ...assignedTo,
        );

        contacts.forEach((c) => {
          c.assignedTo = users.find((u) => u.id === c.assignedTo);
        });
      }

      return chats
        .sort((a, b) => chatIds.indexOf(a.id) - chatIds.indexOf(b.id))
        .map((chat) => ({
          ...chat,
          contact: contacts.find(({ chatId }) => chatId === chat.id),
        }));
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findWithQuery(user: any, query: string): Promise<Chat[]> {
    throw new NotImplementedException();
  }

  async count(user: any): Promise<Record<string, number>> {
    try {
      return await lastValueFrom(
        this.contactsClient.send('contacts.countAll', {
          user,
          data: {},
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findOne(user: any, id: number): Promise<Chat> {
    const [contact] = await lastValueFrom(
      this.contactsClient.send('contacts.forChat', {
        user,
        data: [id],
      }),
    );

    if (!contact) {
      throw new NotFoundException();
    }

    const chat = await lastValueFrom(
      this.messagingClient.send('chats.findOne', {
        user,
        data: id,
      }),
    );

    if (contact.assignedTo) {
      const [assignedTo] = await this.projectService.findAllUsers(
        user,
        contact.assignedTo,
      );

      contact.assignedTo = assignedTo;
    }

    return {
      ...chat,
      contact,
    };
  }

  async received(projectId: number, chat: any): Promise<any> {
    // const contact = await this.contactService.createForChat(
    //   'Bearer '.concat(await this.projectTokenService.get(projectId)),
    //   chat.id,
    //   chat.contact,
    // );
    // if (!silent) {
    //   pubSub.publish(`chatsReceived:${projectId}`, {
    //     chatsReceived: {
    //       ...chat,
    //       contact,
    //     },
    //   });
    // }
  }
}
