import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma.service';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [PrismaService, ProjectResolver, ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
