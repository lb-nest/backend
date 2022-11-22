import { Body, Controller, Param, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { HandleWebhookDto } from './dto/handle-webhook.dto';

@Controller('chatbots')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post(':token')
  handleWebhook(
    @Param('token') token: string,
    @Body() handleWebhookDto: HandleWebhookDto,
  ): void {
    return this.chatbotService.handleWebhook(token, handleWebhookDto);
  }
}
