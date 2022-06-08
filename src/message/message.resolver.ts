import {
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import axios, { AxiosInstance } from 'axios';
import { pubSub } from 'src/app.service';
import { Auth } from 'src/auth/auth.decorator';
import { RoleType } from 'src/auth/enums/role-type.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { CreateMessageInput } from './dto/create-message.input';
import { RemoveChatInput } from './dto/remove-chat.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';

@Resolver(() => Message)
export class MessageResolver {
  private readonly axios: AxiosInstance;

  constructor(
    private readonly messageService: MessageService,
    private readonly configService: ConfigService,
  ) {
    this.axios = axios.create({
      baseURL: this.configService.get<string>('CONTACTS_URL'),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => [Message])
  createMessage(
    @Auth() authorization: string,
    @User() user: any,
    @Args() input: CreateMessageInput,
  ): Promise<Message[]> {
    return this.messageService.create(authorization, user, input);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Message])
  messages(
    @Auth() authorization: string,
    @User() user: any,
    @Args('chatId', { type: () => Int }) chatId: number,
  ): Promise<Message[]> {
    return this.messageService.findAll(authorization, user, chatId);
  }

  @Mutation(() => Message)
  updateMessage(
    @Auth() authorization: string,
    @Args() input: UpdateMessageInput,
  ): Promise<Message> {
    return this.messageService.update(authorization, input);
  }

  @Mutation(() => Message)
  removeMessage(
    @Auth() authorization: string,
    @Args() input: RemoveChatInput,
  ): Promise<Message> {
    return this.messageService.remove(authorization, input);
  }

  @UseGuards(JwtAuthGuard)
  @Subscription(() => Message)
  async messagesReceived(
    @Auth() authorization: string,
    @User() user: any,
    @Args('chatId', { type: () => Int }) chatId: number,
  ) {
    const res = await this.axios(`/contacts/filter?chatIds=${chatId}`, {
      headers: {
        authorization,
      },
    });

    const [contact] = res.data;
    if (!contact) {
      throw new NotFoundException();
    }

    const isAdmin = user.project.roles.some(({ role }) =>
      [RoleType.Admin, RoleType.Owner].includes(role),
    );

    if (!isAdmin && contact.assignedTo !== user.id) {
      throw new BadRequestException();
    }

    const projectId = user.project.id;
    return pubSub.asyncIterator(`messagesReceived:${projectId}:${chatId}`);
  }
}
