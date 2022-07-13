import {
  ForbiddenException,
  Inject,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { pubSub } from 'src/app.service';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { RoleType } from 'src/auth/enums/role-type.enum';
import { User } from 'src/auth/user.decorator';
import { CreateMessageInput } from './dto/create-message.input';
import { ReadMessagesInput } from './dto/read-messages.input';
import { RemoveMessageInput } from './dto/remove-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';

@Resolver(() => Message)
export class MessageResolver {
  constructor(
    @Inject('CONTACTS') private readonly client: ClientProxy,
    private readonly messageService: MessageService,
  ) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => [Message])
  createMessage(
    @User() user: any,
    @Args() input: CreateMessageInput,
  ): Promise<Message[]> {
    return this.messageService.create(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Query(() => [Message])
  messages(
    @User() user: any,
    @Args('chatId', { type: () => Int }) chatId: number,
  ): Promise<Message[]> {
    return this.messageService.findAll(user, chatId);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Message)
  updateMessage(
    @User() user: any,
    @Args() input: UpdateMessageInput,
  ): Promise<Message> {
    return this.messageService.update(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Message)
  removeMessage(
    @User() user: any,
    @Args() input: RemoveMessageInput,
  ): Promise<Message> {
    return this.messageService.remove(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Boolean)
  markMessagesAsRead(
    @User() user: any,
    @Args() input: ReadMessagesInput,
  ): Promise<boolean> {
    return this.messageService.markAsRead(user, input);
  }

  @UseGuards(BearerAuthGuard)
  @Subscription(() => Message)
  async messagesReceived(
    @User() user: any,
    @Args('chatId', { type: () => Int }) chatId: number,
  ) {
    const [contact] = await lastValueFrom(
      this.client.send('contacts.forChat', {
        user,
        data: [chatId],
      }),
    );

    if (!contact) {
      throw new NotFoundException();
    }

    const isAdmin = user.project.roles.some(({ role }) =>
      [RoleType.Admin, RoleType.Owner].includes(role),
    );

    if (!isAdmin && contact.assignedTo !== user.id) {
      throw new ForbiddenException();
    }

    const projectId = user.project.id;
    return pubSub.asyncIterator(`messagesReceived:${projectId}:${chatId}`);
  }
}
