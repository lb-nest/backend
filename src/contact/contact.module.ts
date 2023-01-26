import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { ContactAssignedToService } from './contact-assigned-to.service';
import { ContactChatService } from './contact-chat.service';
import { ContactHistoryService } from './contact-history.service';
import { ContactTagService } from './contact-tag.service';
import { ContactResolver } from './contact.resolver';
import { ContactService } from './contact.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [
    ContactAssignedToService,
    ContactChatService,
    ContactHistoryService,
    ContactTagService,
    ContactResolver,
    ContactService,
  ],
  exports: [
    ContactAssignedToService,
    ContactChatService,
    ContactTagService,
    ContactService,
  ],
})
export class ContactModule {}
