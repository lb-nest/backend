import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { WalletResolver } from './wallet.resolver';
import { WalletService } from './wallet.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [WalletResolver, WalletService],
  exports: [WalletService],
})
export class WalletModule {}
