import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from 'src/project/project.module';
import { ContactFlowService } from './contact-flow.service';
import { ContactResolver } from './contact.resolver';
import { ContactService } from './contact.service';

@Module({
  imports: [ConfigModule, ProjectModule],
  providers: [ContactResolver, ContactService, ContactFlowService],
})
export class ContactModule {}
