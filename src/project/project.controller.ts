import { Body, Controller, Param, Post } from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller('api/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post(':id/webhook')
  async handleWebhook(
    @Param('id') id: string,
    @Body() payload: any,
  ): Promise<void> {
    return this.projectService.handleWebhook(Number(id), payload);
  }
}
