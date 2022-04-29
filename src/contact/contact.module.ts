import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from 'src/project/project.module';
import { ContactFlowService } from './contact-flow.service';
import { ContactResolver } from './contact.resolver';
import { ContactService } from './contact.service';
import { ContactUpdatedListener } from './listeners/contact-updated.listener';

@Module({
  imports: [ConfigModule, ProjectModule],
  providers: [
    ContactResolver,
    ContactService,
    ContactFlowService,
    ContactUpdatedListener,
  ],
  exports: [ContactService],
})
export class ContactModule {}
