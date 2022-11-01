import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [WalletModule],
  providers: [BillingService],
})
export class BillingModule {}
