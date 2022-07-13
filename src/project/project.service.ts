import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import axios, { AxiosInstance } from 'axios';
import { Token } from 'src/auth/entities/token.entity';
import { ChatbotEventType } from 'src/chatbot/enums/chatbot-event-type.enum';
import { ContactService } from 'src/contact/contact.service';
import { pubSub } from 'src/pubsub';
import { User } from 'src/user/entities/user.entity';
import { WebhookEventType } from 'src/webhook/enums/webhook-event-type.enum';
import { CreateProjectInput } from './dto/create-project.input';
import { InviteInput } from './dto/invite.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { ProjectWithToken } from './entities/project-with-token.entity';
import { Project } from './entities/project.entity';
import { ProjectTokenService } from './project-token.service';

@Injectable()
export class ProjectService {
  private readonly axios: AxiosInstance;

  constructor(
    private readonly projectTokenService: ProjectTokenService,
    private readonly configService: ConfigService,
    private readonly contactService: ContactService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.axios = axios.create({
      baseURL: configService.get<string>('AUTHORIZATION_URL'),
    });
  }

  async create(
    authorization: string,
    input: CreateProjectInput,
  ): Promise<ProjectWithToken> {
    try {
      const res = await this.axios.post<Project>('/projects', input, {
        headers: {
          authorization,
        },
      });

      await this.createWebhooks(authorization, res.data.id);
      return {
        ...res.data,
        token: await this.projectTokenService.save(
          res.data.id,
          await this.signIn(authorization, res.data.id),
        ),
      };
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async getMe(authorization: string): Promise<Project> {
    try {
      const res = await this.axios.get<Project>('/projects/@me', {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async update(
    authorization: string,
    input: UpdateProjectInput,
  ): Promise<Project> {
    try {
      const res = await this.axios.patch<Project>('/projects/@me', input, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async remove(authorization: string): Promise<Project> {
    throw new NotImplementedException();
  }

  async signIn(authorization: string, id: number): Promise<Token> {
    try {
      const res = await this.axios.get<Token>(`/projects/${id}/token`, {
        headers: {
          authorization,
        },
      });

      return res.data;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async invite(authorization: string, input: InviteInput): Promise<boolean> {
    try {
      await this.axios.post<any>('/projects/@me/users', input, {
        headers: {
          authorization,
        },
      });

      return true;
    } catch (e) {
      throw new BadRequestException(e.response.data);
    }
  }

  async getUsers(authorization: string, ...ids: number[]): Promise<User[]> {
    const query = new URLSearchParams();
    if (ids.length) {
      query.set('ids', ids.join(','));
    }

    const res = await this.axios.get<any[]>(`/projects/@me/users?${query}`, {
      headers: {
        authorization,
      },
    });

    return res.data;
  }

  private async createWebhooks(authorization: string, id: number) {
    const backend = this.configService.get<string>('BACKEND_URL');
    const messaging = this.configService.get<string>('MESSAGING_URL');

    const webhooks = [
      {
        name: 'system.backend',
        url: backend.concat(`/projects/${id}/webhook`),
        eventType: WebhookEventType.All,
      },
    ];

    const token = await this.signIn(authorization, id);
    await Promise.all(
      webhooks.map((webhook) =>
        axios.post<any>(messaging.concat('/webhooks'), webhook, {
          headers: {
            authorization: 'Bearer '.concat(token.token),
          },
        }),
      ),
    );
  }

  async handleWebhook(projectId: number, payload: any): Promise<void> {
    switch (payload.type) {
      case WebhookEventType.IncomingChats:
        this.eventEmitter.emit(
          ChatbotEventType.NewEvent,
          await this.handleChatsReceived(projectId, payload.payload),
        );
        break;

      case WebhookEventType.OutgoingChats:
        await this.handleChatsReceived(projectId, payload.payload);
        break;

      case WebhookEventType.IncomingMessages:
      case WebhookEventType.OutgoingMessages:
        await this.handleMessagesReceived(projectId, payload.payload);
        break;
    }
  }

  private async handleChatsReceived(
    projectId: number,
    chat: any,
    silent = false,
  ): Promise<any> {
    const contact = await this.contactService.createForChat(
      'Bearer '.concat(await this.projectTokenService.get(projectId)),
      chat.id,
      chat.contact,
    );

    if (!silent) {
      pubSub.publish(`chatsReceived:${projectId}`, {
        chatsReceived: {
          ...chat,
          contact,
        },
      });
    }

    return {
      projectId,
      ...chat,
      contact,
    };
  }

  private async handleMessagesReceived(
    projectId: number,
    messages: any[],
  ): Promise<void> {
    messages
      .sort((a, b) => a.id - b.id)
      .map((message) => {
        pubSub.publish(`messagesReceived:${projectId}:${message.chat.id}`, {
          messagesReceived: message,
        });
      });
  }
}
