import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MESSAGING_SERVICE } from 'src/shared/constants/broker';
import { CreateHsmArgs } from './dto/create-hsm.args';
import { UpdateHsmArgs } from './dto/update-hsm.args';
import { Hsm } from './entities/hsm.entity';

@Injectable()
export class HsmService {
  constructor(
    @Inject(MESSAGING_SERVICE) private readonly client: ClientProxy,
  ) {}

  create(authorization: string, createHsmArgs: CreateHsmArgs): Observable<Hsm> {
    return this.client.send<Hsm>('hsm.create', {
      headers: {
        authorization,
      },
      payload: createHsmArgs,
    });
  }

  findAll(authorization: string): Observable<Hsm[]> {
    return this.client.send<Hsm[]>('hsm.findAll', {
      headers: {
        authorization,
      },
      payload: null,
    });
  }

  findOne(authorization: string, id: number): Observable<Hsm> {
    return this.client.send<Hsm>('hsm.findOne', {
      headers: {
        authorization,
      },
      payload: id,
    });
  }

  update(authorization: string, updateHsmArgs: UpdateHsmArgs): Observable<Hsm> {
    return this.client.send<Hsm>('hsm.update', {
      headers: {
        authorization,
      },
      payload: updateHsmArgs,
    });
  }

  remove(authorization: string, id: number): Observable<Hsm> {
    return this.client.send<Hsm>('hsm.remove', {
      headers: {
        authorization,
      },
      payload: id,
    });
  }
}
