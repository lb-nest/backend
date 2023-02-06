import { ArgsType, Field } from '@nestjs/graphql';
import { IsEnum, IsNumber } from 'class-validator';
import { PaymentProvider } from '../enums/payment-provider.enum';

@ArgsType()
export class CreatePaymentArgs {
  @Field(() => PaymentProvider)
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @Field(() => Number)
  @IsNumber()
  amount: number;
}
