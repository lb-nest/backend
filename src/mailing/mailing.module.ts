import { Module } from '@nestjs/common';
import { MailingResolver } from './mailing.resolver';
import { MailingService } from './mailing.service';

@Module({
  providers: [MailingResolver, MailingService],
})
export class MailingModule {}
