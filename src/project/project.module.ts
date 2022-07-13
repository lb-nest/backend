import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { AUTH_SERVICE } from 'src/shared/rabbitmq/constants';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';
import { ProjectTokenService } from './project-token.service';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [
    ConfigModule,
    RabbitMQModule.register({
      name: AUTH_SERVICE,
    }),
  ],
  providers: [
    ProjectResolver,
    ProjectService,
    ProjectTokenService,
    PrismaService,
  ],
  exports: [ProjectResolver, ProjectService, ProjectTokenService],
})
export class ProjectModule {}
