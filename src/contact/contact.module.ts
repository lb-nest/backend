import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { ContactAssignedToService } from './contact-assigned-to.service';
import { ContactFlowService } from './contact-flow.service';
import { ContactHistoryService } from './contact-history.service';
import { ContactTagService } from './contact-tag.service';
import { ContactResolver } from './contact.resolver';
import { ContactService } from './contact.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [
    ContactResolver,
    ContactService,
    ContactAssignedToService,
    ContactFlowService,
    ContactHistoryService,
    ContactTagService,
  ],
  exports: [ContactService, ContactFlowService, ContactTagService],
})
export class ContactModule {}
