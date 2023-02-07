import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BILLING_SERVICE } from 'src/shared/constants/broker';
import { SubscriptionEntity } from './entities/subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(@Inject(BILLING_SERVICE) private readonly client: ClientProxy) {}

  create(projectId: number): Observable<SubscriptionEntity> {
    return this.client.send<SubscriptionEntity>('createSubscription', {
      projectId,
    });
  }
}
