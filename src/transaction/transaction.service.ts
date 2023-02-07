import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BILLING_SERVICE } from 'src/shared/constants/broker';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(@Inject(BILLING_SERVICE) private readonly client: ClientProxy) {}

  findAll(projectId: number): Observable<Transaction[]> {
    return this.client.send<Transaction[]>('findAllTransactions', {
      projectId,
    });
  }
}
