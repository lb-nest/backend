import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { ContactFlowService } from './contact-flow.service';
import { ContactResolver } from './contact.resolver';
import { ContactService } from './contact.service';

@Module({
  imports: [ConfigModule, UserModule],
  providers: [ContactResolver, ContactService, ContactFlowService],
})
export class ContactModule {}
