import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma.service';
import { ProjectTokenService } from './project-token.service';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [
    PrismaService,
    ProjectTokenService,
    ProjectResolver,
    ProjectService,
  ],
  exports: [ProjectTokenService, ProjectService],
})
export class ProjectModule {}
