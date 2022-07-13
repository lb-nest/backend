import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { pubSub } from 'src/app.module';
import { CreateMessageInput } from './dto/create-message.input';
import { ReadMessagesInput } from './dto/read-messages.input';
import { RemoveMessageInput } from './dto/remove-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @Inject('CONTACTS') private readonly contactClient: ClientProxy,
    @Inject('MESSAGING') private readonly messagingClient: ClientProxy,
  ) {}

  async create(user: any, input: CreateMessageInput): Promise<Message[]> {
    try {
      const [contact] = await lastValueFrom(
        this.contactClient.send('contacts.forChat', {
          user,
          data: [input.chatId],
        }),
      );

      if (![user.id].includes(contact?.assignedTo)) {
        throw new ForbiddenException();
      }

      return await lastValueFrom(
        this.messagingClient.send('chats.messages.create', {
          user,
          data: input,
        }),
      );
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e);
    }
  }

  async findAll(user: any, chatId: number): Promise<Message[]> {
    try {
      const [contact] = await lastValueFrom(
        this.contactClient.send('contacts.forChat', {
          user,
          data: [chatId],
        }),
      );

      if (![user.id, null].includes(contact?.assignedTo)) {
        throw new ForbiddenException();
      }

      return await lastValueFrom(
        this.messagingClient.send('chats.messages.findAll', {
          user,
          data: chatId,
        }),
      );
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e);
    }
  }

  async update(user: any, input: UpdateMessageInput): Promise<Message> {
    throw new NotImplementedException();
  }

  async remove(user: any, input: RemoveMessageInput): Promise<Message> {
    throw new NotImplementedException();
  }

  async markAsRead(user: any, input: ReadMessagesInput): Promise<boolean> {
    try {
      const [contact] = await lastValueFrom(
        this.contactClient.send('contacts.forChat', {
          user,
          data: [input.chatId],
        }),
      );

      if (![user.id, null].includes(contact?.assignedTo)) {
        throw new ForbiddenException();
      }

      return await lastValueFrom(
        this.contactClient.send('chats.messages.markAsRead', {
          user,
          data: input,
        }),
      );
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      throw new BadRequestException(e);
    }
  }

  async received(projectId: number, messages: any[]): Promise<any> {
    messages
      .sort((a, b) => a.id - b.id)
      .map((message) => {
        pubSub.publish(`messagesReceived:${projectId}:${message.chat.id}`, {
          messagesReceived: message,
        });
      });
  }
}
