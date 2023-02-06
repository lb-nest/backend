import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BILLING_SERVICE } from 'src/shared/constants/broker';
import { CreatePaymentArgs } from './dto/create-payment.args';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(@Inject(BILLING_SERVICE) private readonly client: ClientProxy) {}

  create(
    projectId: number,
    createPaymentArgs: CreatePaymentArgs,
  ): Observable<Payment> {
    return this.client.send<Payment>('createPayment', {
      projectId,
      ...createPaymentArgs,
    });
  }
}
