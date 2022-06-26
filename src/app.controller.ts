import { Body, Controller, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('api/projects/:id/webhook')
  async handleWebhook(
    @Param('id') id: string,
    @Body() payload: any,
  ): Promise<void> {
    return this.appService.handleWebhook(Number(id), payload);
  }
}
