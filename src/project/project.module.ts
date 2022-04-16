import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [ConfigModule],
  providers: [ProjectResolver, ProjectService],
})
export class ProjectModule {}
