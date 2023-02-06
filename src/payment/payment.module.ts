import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [PaymentResolver, PaymentService],
})
export class PaymentModule {}
