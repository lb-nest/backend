import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { ContactFlowService } from './contact-flow.service';
import { ContactHistoryService } from './contact-history.service';
import { ContactTagService } from './contact-tag.service';
import { ContactResolver } from './contact.resolver';
import { ContactService } from './contact.service';
import { ContactEventListener } from './listeners/contact-event.listener';
@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [
    ContactResolver,
    ContactService,
    ContactFlowService,
    ContactHistoryService,
    ContactTagService,
    ContactEventListener,
  ],
  exports: [ContactService],
})
export class ContactModule {}
