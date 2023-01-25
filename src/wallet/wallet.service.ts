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
    projectId: number,
    createWalletArgs: CreateWalletArgs,
  ): Observable<Wallet> {
    return this.client.send<Wallet>('createWallet', {
      projectId,
      ...createWalletArgs,
    });
  }

  findAll(...projectIds: number[]): Observable<Wallet[]> {
    return this.client.send<Wallet[]>('findAllWallets', {
      projectIds,
    });
  }

  findOne(projectId: number): Observable<Wallet> {
    return this.client.send<Wallet>('findOneWallet', {
      projectId,
    });
  }

  update(
    projectId: number,
    updateWalletArgs: UpdateWalletArgs,
  ): Observable<Wallet> {
    return this.client.send<Wallet>('updateWallet', {
      projectId,
      ...updateWalletArgs,
    });
  }

  remove(projectId: number): Observable<Wallet> {
    return this.client.send<Wallet>('removeWallet', {
      projectId,
    });
  }
}
