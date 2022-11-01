import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { BillingService } from './billing.service';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [forwardRef(() => AppModule), WalletModule],
  providers: [BillingService],
})
export class BillingModule {}
