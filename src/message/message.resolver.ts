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
import axios from 'axios';
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
  constructor(
    private readonly messageService: MessageService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => [Message])
  createMessage(
    @Auth() authorization: string,
    @User() user: any,
    @Args() input: CreateMessageInput,
  ) {
    return this.messageService.create(authorization, user, input);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Message])
  messages(
    @Auth() authorization: string,
    @User() user: any,
    @Args('chatId', { type: () => Int }) chatId: number,
  ) {
    return this.messageService.findAll(authorization, user, chatId);
  }

  @Mutation(() => Message)
  updateMessage(
    @Auth() authorization: string,
    @Args() input: UpdateMessageInput,
  ) {
    return this.messageService.update(authorization, input);
  }

  @Mutation(() => Message)
  removeMessage(@Auth() authorization: string, @Args() input: RemoveChatInput) {
    return this.messageService.remove(authorization, input);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Subscription(() => Message)
  async messagesReceived(
    @Auth() authorization: string,
    @User() user: any,
    @Args('chatId', { type: () => Int }) chatId: number,
  ) {
    const url = this.configService.get<string>('CONTACTS_URL');
    const res = await axios(url.concat(`/contacts/batch?chatIds=${chatId}`), {
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
