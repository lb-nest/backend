import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [TransactionResolver, TransactionService],
})
export class TransactionModule {}
