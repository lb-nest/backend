import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ChatbotEventType } from 'src/chatbot/enums/chatbot-event-type.enum';
import { pubSub } from 'src/pubsub';
import { MESSAGING_SERVICE } from 'src/shared/constants/broker';
import { CreateMessageArgs } from './dto/create-message.args';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @Inject(MESSAGING_SERVICE) private readonly client: ClientProxy,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    projectId: number,
    createMessageArgs: CreateMessageArgs,
  ): Promise<Message[]> {
    return lastValueFrom(
      this.client.send<Message[]>('createMessage', {
        projectId,
        ...createMessageArgs,
      }),
    );
  }

  async findAll(projectId: number, chatId: number): Promise<Message[]> {
    return lastValueFrom(
      this.client.send<Message[]>('findAllMessages', {
        projectId,
        chatId,
      }),
    );
  }

  async received(projectId: number, message: any): Promise<void> {
    this.eventEmitter.emit(ChatbotEventType.Message, projectId, message);

    pubSub.publish(
      `messageReceived:${projectId}:${message.accountId}:${message.channelId}`,
      {
        messageReceived: message,
      },
    );
  }
}
