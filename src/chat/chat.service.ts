import {
  Injectable,
  NotFoundException,
  NotImplementedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Context, Int, Subscription } from '@nestjs/graphql';
import axios from 'axios';
import { pubSub } from 'src/app.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  private readonly messagingUrl: string;
  private readonly contactsUrl: string;

  constructor(configService: ConfigService) {
    this.messagingUrl = configService.get<string>('MESSAGING_URL');
    this.contactsUrl = configService.get<string>('CONTACTS_URL');
  }

  async create(authorization: string, input: CreateChatInput) {
    return;
  }

  async findAll(authorization: string) {
    const contacts = await axios(this.contactsUrl.concat('/contacts'), {
      headers: {
        authorization,
      },
    });

    const ids = contacts.data.map((contact) => contact.chatId);
    const chats = await axios(
      this.messagingUrl.concat(`/chats?ids=${ids.join(',')}`),
      {
        headers: {
          authorization,
        },
      },
    );

    return chats.data.map((chat) =>
      Object.assign(chat, {
        contact: contacts.data.find((contact) => contact.chatId === chat.id),
      }),
    );
  }

  async findOne(authorization: string, id: number) {
    const contacts = await axios(
      this.contactsUrl.concat(`/contacts?chatIds=${id}`),
      {
        headers: {
          authorization,
        },
      },
    );

    if (contacts.data.length !== 1) {
      throw new NotFoundException();
    }

    const chat = await axios(this.messagingUrl.concat(`/chats/${id}`), {
      headers: {
        authorization,
      },
    });

    return Object.assign(chat.data, {
      contact: contacts.data.find((contact) => contact.chatId === chat.data.id),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Subscription(() => Chat)
  async messagesReceived(
    @Context('req') req: any,
    @Args('chatId', { type: () => Int }) chatId: number,
  ) {
    const projectId = req.user.project.id;
    return pubSub.asyncIterator(`chatsReceived:${projectId}:${chatId}`);
  }

  async update(authorization: string, input: UpdateChatInput) {
    throw new NotImplementedException();
  }

  async remove(authorization: string, id: number) {
    throw new NotImplementedException();
  }
}
