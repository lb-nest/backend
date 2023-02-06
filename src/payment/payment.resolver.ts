import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BearerAuth } from 'src/auth/decorators/bearer-auth.decorator';
import { BearerAuthGuard } from 'src/auth/guargs/bearer-auth.guard';
import { Auth } from 'src/auth/interfaces/auth.interface';
import { CreatePaymentArgs } from './dto/create-payment.args';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(BearerAuthGuard)
  @Mutation(() => Payment)
  createPayment(
    @BearerAuth() auth: Required<Auth>,
    @Args() createPaymentArgs: CreatePaymentArgs,
  ): Observable<Payment> {
    return this.paymentService.create(auth.project.id, createPaymentArgs);
  }
}
