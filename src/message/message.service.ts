import {
  ForbiddenException,
  Inject,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { decode } from 'jsonwebtoken';
import { lastValueFrom } from 'rxjs';
import { TokenPayload } from 'src/auth/entities/token-payload.entity';
import { ContactService } from 'src/contact/contact.service';
import { pubSub } from 'src/pubsub';
import { MESSAGING_SERVICE } from 'src/shared/constants/broker';
import { CreateMessageArgs } from './dto/create-message.args';
import { ReadMessagesArgs } from './dto/read-messages.args';
import { UpdateMessageArgs } from './dto/update-message.args';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @Inject(MESSAGING_SERVICE) private readonly client: ClientProxy,
    private readonly contactService: ContactService,
  ) {}

  async create(
    authorization: string,
    createMessageArgs: CreateMessageArgs,
  ): Promise<Message[]> {
    const [contact] = await this.contactService.findAllForChat(
      authorization,
      createMessageArgs.chatId,
    );

    const user = <TokenPayload>decode(authorization.slice(7));
    if (user.id !== contact.assignedTo?.id) {
      throw new ForbiddenException();
    }

    return lastValueFrom(
      this.client.send<Message[]>('chats.createMessage', {
        headers: {
          authorization,
        },
        payload: createMessageArgs,
      }),
    );
  }

  async findAll(authorization: string, chatId: number): Promise<Message[]> {
    const [contact] = await this.contactService.findAllForChat(
      authorization,
      chatId,
    );

    const user = <TokenPayload>decode(authorization.slice(7));
    if (![user.id, undefined].includes(contact.assignedTo?.id)) {
      throw new ForbiddenException();
    }

    return lastValueFrom(
      this.client.send<Message[]>('chats.findAllMessages', {
        headers: {
          authorization,
        },
        payload: chatId,
      }),
    );
  }

  async update(
    authorization: string,
    updateMessageArgs: UpdateMessageArgs,
  ): Promise<Message> {
    throw new NotImplementedException();
  }

  async remove(authorization: string, id: number): Promise<Message> {
    throw new NotImplementedException();
  }

  async markAsRead(
    authorization: string,
    readMessagesArgs: ReadMessagesArgs,
  ): Promise<boolean> {
    const [contact] = await this.contactService.findAllForChat(
      authorization,
      readMessagesArgs.chatId,
    );

    const user = <TokenPayload>decode(authorization.slice(7));
    if (user.id !== contact.assignedTo?.id) {
      throw new ForbiddenException();
    }

    return lastValueFrom(
      this.client.send<boolean>('chats.markMessagesAsRead', {
        headers: {
          authorization,
        },
        payload: readMessagesArgs,
      }),
    );
  }

  async received(projectId: number, message: any): Promise<void> {
    pubSub.publish(`messagesReceived:${projectId}:${message.chat.id}`, {
      messagesReceived: message,
    });
  }
}
