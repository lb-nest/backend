import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { MailingResolver } from './mailing.resolver';
import { MailingService } from './mailing.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [MailingResolver, MailingService],
})
export class MailingModule {}
