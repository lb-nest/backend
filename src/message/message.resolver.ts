import {
  ForbiddenException,
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
import { Auth } from 'src/auth/auth.decorator';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { TokenPayload } from 'src/auth/entities/token-payload.entity';
import { ContactService } from 'src/contact/contact.service';
import { RoleType } from 'src/project/enums/role-type.enum';
import { pubSub } from 'src/pubsub';
import { GqlHeaders } from 'src/shared/decorators/gql-headers.decorator';
import { CreateMessageArgs } from './dto/create-message.args';
import { ReadMessagesArgs } from './dto/read-messages.args';
import { UpdateMessageArgs } from './dto/update-message.args';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';

@Resolver(() => Message)
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,
    private readonly contactService: ContactService,
  ) {}

  @Mutation(() => [Message])
  createMessage(
    @GqlHeaders('authorization') authorization: string,
    @Args() createMessageArgs: CreateMessageArgs,
  ): Promise<Message[]> {
    return this.messageService.create(authorization, createMessageArgs);
  }

  @Query(() => [Message])
  messages(
    @GqlHeaders('authorization') authorization: string,
    @Args('chatId', { type: () => Int }) chatId: number,
  ): Promise<Message[]> {
    return this.messageService.findAll(authorization, chatId);
  }

  @Mutation(() => Message)
  updateMessage(
    @GqlHeaders('authorization') authorization: string,
    @Args() updateMessageArgs: UpdateMessageArgs,
  ): Promise<Message> {
    return this.messageService.update(authorization, updateMessageArgs);
  }

  @Mutation(() => Message)
  removeMessage(
    @GqlHeaders('authorization') authorization: string,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Message> {
    return this.messageService.remove(authorization, id);
  }

  @Mutation(() => Boolean)
  markMessagesAsRead(
    @GqlHeaders('authorization') authorization: string,
    @Args() readMessagesArgs: ReadMessagesArgs,
  ): Promise<boolean> {
    return this.messageService.markAsRead(authorization, readMessagesArgs);
  }

  @UseGuards(BearerAuthGuard)
  @Subscription(() => Message)
  async messagesReceived(
    @GqlHeaders('authorization') authorization: string,
    @Auth() auth: Required<TokenPayload>,
    @Args('chatId', { type: () => Int }) chatId: number,
  ) {
    const [contact] = await this.contactService.findOneForChat(
      authorization,
      chatId,
    );

    if (!contact) {
      throw new NotFoundException();
    }

    const isAdmin = auth.project.roles.some(({ role }) =>
      [RoleType.Admin, RoleType.Owner].includes(role),
    );

    if (!isAdmin && contact.assignedTo?.id !== auth.id) {
      throw new ForbiddenException();
    }

    const projectId = auth.project.id;
    return pubSub.asyncIterator(`messagesReceived:${projectId}:${chatId}`);
  }
}
