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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Mutation(() => [Message])
  createMessage(@Context() context: any, @Args() input: CreateMessageInput) {
    return this.messageService.create(context.req.headers.authorization, input);
  }

  @Query(() => [Message])
  messages(@Context() context: any) {
    return this.messageService.findAll(context.req.headers.authorization);
  }

  @UseGuards(JwtAuthGuard)
  @Subscription(() => Message)
  messagesReceived(
    @Context() context: any,
    @Args('chatId', { type: () => Int }) chatId: number,
  ) {
    const projectId = context.req.user.project.id;
    return pubSub.asyncIterator(`messagesReceived:${projectId}:${chatId}`);
  }

  @Mutation(() => Message)
  updateMessage(@Context() context: any, @Args() input: UpdateMessageInput) {
    return this.messageService.update(context.req.headers.authorization, input);
  }

  @Mutation(() => Message)
  removeMessage(
    @Context() context: any,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.messageService.remove(context.req.headers.authorization, id);
  }
}
