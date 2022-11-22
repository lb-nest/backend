import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BILLING_SERVICE } from 'src/shared/constants/broker';
import { CreateWalletArgs } from './dto/create-wallet.args';
import { UpdateWalletArgs } from './dto/update-wallet.args';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(@Inject(BILLING_SERVICE) private readonly client: ClientProxy) {}

  create(
    authorization: string,
    createWalletArgs: CreateWalletArgs,
  ): Observable<Wallet> {
    return this.client.send<Wallet>('wallet.create', {
      headers: {
        authorization,
      },
      payload: createWalletArgs,
    });
  }

  findOne(authorization: string): Observable<Wallet> {
    return this.client.send<Wallet>('wallet.findOne', {
      headers: {
        authorization,
      },
      payload: null,
    });
  }

  update(
    authorization: string,
    updateWalletArgs: UpdateWalletArgs,
  ): Observable<Wallet> {
    return this.client.send<Wallet>('wallet.update', {
      headers: {
        authorization,
      },
      payload: updateWalletArgs,
    });
  }

  remove(authorization: string): Observable<Wallet> {
    return this.client.send<Wallet>('wallet.remove', {
      headers: {
        authorization,
      },
      payload: null,
    });
  }
}
