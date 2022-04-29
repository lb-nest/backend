import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { ProjectTokenService } from './project-token.service';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [ConfigModule],
  providers: [
    ProjectResolver,
    ProjectService,
    ProjectTokenService,
    PrismaService,
  ],
  exports: [ProjectService, ProjectTokenService],
})
export class ProjectModule {}
