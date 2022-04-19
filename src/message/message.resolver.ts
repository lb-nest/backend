import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { pubSub } from 'src/app.service';
import { Auth } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateMessageInput } from './dto/create-message.input';
import { RemoveChatInput } from './dto/remove-chat.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Mutation(() => [Message])
  createMessage(
    @Auth() authorization: string,
    @Args() input: CreateMessageInput,
  ) {
    return this.messageService.create(authorization, input);
  }

  @Query(() => [Message])
  messages(
    @Auth() authorization: string,
    @Args('chatId', { type: () => Int }) chatId: number,
  ) {
    return this.messageService.findAll(authorization, chatId);
  }

  @UseGuards(JwtAuthGuard)
  @Subscription(() => Message)
  messagesReceived(
    @Context('req') req: any,
    @Args('chatId', { type: () => Int }) chatId: number,
  ) {
    const projectId = req.user.project.id;

    // TODO: проверка contact.status, contact.assignedTo

    return pubSub.asyncIterator(`messagesReceived:${projectId}:${chatId}`);
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
}
