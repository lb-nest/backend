import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { IntegrationResolver } from './integration.resolver';
import { IntegrationService } from './integration.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [IntegrationResolver, IntegrationService],
})
export class IntegrationModule {}
