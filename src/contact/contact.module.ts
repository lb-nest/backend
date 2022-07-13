import { Module } from '@nestjs/common';
import { ProjectModule } from 'src/project/project.module';
import { ContactFlowService } from './contact-flow.service';
import { ContactHistoryService } from './contact-history.service';
import { ContactTagService } from './contact-tag.service';
import { ContactResolver } from './contact.resolver';
import { ContactService } from './contact.service';
import { ContactUpdateListener } from './listeners/contact-update.listener';

@Module({
  imports: [ProjectModule],
  providers: [
    ContactResolver,
    ContactService,
    ContactFlowService,
    ContactHistoryService,
    ContactTagService,
    ContactUpdateListener,
  ],
  exports: [ContactResolver, ContactService],
})
export class ContactModule {}
