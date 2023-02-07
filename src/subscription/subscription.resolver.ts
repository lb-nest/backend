import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BearerAuth } from 'src/auth/decorators/bearer-auth.decorator';
import { BearerAuthGuard } from 'src/auth/guargs/bearer-auth.guard';
import { Auth } from 'src/auth/interfaces/auth.interface';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionService } from './subscription.service';

@Resolver(() => SubscriptionEntity)
export class SubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => SubscriptionEntity)
  createSubscription(
    @BearerAuth() auth: Required<Auth>,
  ): Observable<SubscriptionEntity> {
    return this.subscriptionService.create(auth.project.id);
  }
}
