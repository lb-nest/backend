import { Injectable, NotImplementedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateWalletArgs } from './dto/create-wallet.args';
import { UpdateWalletArgs } from './dto/update-wallet.args';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  create(
    authorization: string,
    createWalletArgs: CreateWalletArgs,
  ): Observable<Wallet> {
    throw new NotImplementedException();
  }

  findOne(authorization: string): Observable<Wallet> {
    throw new NotImplementedException();
  }

  update(
    authorization: string,
    updateWalletArgs: UpdateWalletArgs,
  ): Observable<Wallet> {
    throw new NotImplementedException();
  }

  remove(authorization: string): Observable<Wallet> {
    throw new NotImplementedException();
  }
}
