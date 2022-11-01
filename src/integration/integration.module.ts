import { Module } from '@nestjs/common';
import { IntegrationResolver } from './integration.resolver';
import { IntegrationService } from './integration.service';

@Module({
  providers: [IntegrationResolver, IntegrationService],
})
export class IntegrationModule {}
