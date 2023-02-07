import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { SubscriptionResolver } from './subscription.resolver';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [SubscriptionResolver, SubscriptionService],
})
export class SubscriptionModule {}
