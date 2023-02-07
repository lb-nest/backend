import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BearerAuth } from 'src/auth/decorators/bearer-auth.decorator';
import { BearerAuthGuard } from 'src/auth/guargs/bearer-auth.guard';
import { Auth } from 'src/auth/interfaces/auth.interface';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(BearerAuthGuard)
  @Query(() => [Transaction])
  transactions(@BearerAuth() auth: Required<Auth>): Observable<Transaction[]> {
    return this.transactionService.findAll(auth.project.id);
  }
}
