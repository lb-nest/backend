import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BILLING_SERVICE } from 'src/shared/constants/broker';

@Injectable()
export class BillingService {
  constructor(@Inject(BILLING_SERVICE) private readonly client: ClientProxy) {}

  initialize(authorization: string): Observable<boolean> {
    return this.client.send('admin.initialize', {
      headers: {
        authorization,
      },
    });
  }
}
