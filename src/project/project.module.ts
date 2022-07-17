import { forwardRef, Module } from '@nestjs/common';
import { ContactModule } from 'src/contact/contact.module';
import { ContactService } from 'src/contact/contact.service';
import { PrismaService } from 'src/prisma.service';
import { ProjectTokenService } from './project-token.service';
import { ProjectController } from './project.controller';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [forwardRef(() => ContactModule)],
  providers: [
    ContactService,
    ProjectResolver,
    ProjectService,
    ProjectTokenService,
    PrismaService,
  ],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
