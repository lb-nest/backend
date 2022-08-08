import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AUTH_SERVICE } from 'src/shared/rabbitmq/constants';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';
import { ProjectTokenService } from './project-token.service';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [
    RabbitMQModule.register({
      name: AUTH_SERVICE,
    }),
  ],
  providers: [
    PrismaService,
    ProjectTokenService,
    ProjectResolver,
    ProjectService,
  ],
  exports: [ProjectTokenService, ProjectService],
})
export class ProjectModule {}
