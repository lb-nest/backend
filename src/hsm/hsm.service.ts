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

  create(projectId: number, createHsmArgs: CreateHsmArgs): Observable<Hsm> {
    return this.client.send<Hsm>('createHsm', {
      projectId,
      ...createHsmArgs,
    });
  }

  findAll(projectId: number): Observable<Hsm[]> {
    return this.client.send<Hsm[]>('findAllHsm', {
      projectId,
    });
  }

  findOne(projectId: number, id: number): Observable<Hsm> {
    return this.client.send<Hsm>('findOneHsm', {
      projectId,
      id,
    });
  }

  update(projectId: number, updateHsmArgs: UpdateHsmArgs): Observable<Hsm> {
    return this.client.send<Hsm>('updateHsm', {
      projectId,
      ...updateHsmArgs,
    });
  }

  remove(projectId: number, id: number): Observable<Hsm> {
    return this.client.send<Hsm>('removeHsm', {
      projectId,
      id,
    });
  }
}
