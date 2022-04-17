import { Body, Controller, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('api/projects/:id/events')
  handleEvents(@Param('id') id: string, @Body() events: any) {
    this.appService.handleEvents(Number(id), events);
  }
}
