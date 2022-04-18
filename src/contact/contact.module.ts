import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactResolver } from './contact.resolver';
import { ContactService } from './contact.service';

@Module({
  imports: [ConfigModule],
  providers: [ContactResolver, ContactService],
})
export class ContactModule {}
