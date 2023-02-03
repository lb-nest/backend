import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MAILINGS_SERVICE } from 'src/shared/constants/broker';
import { CreateMailingArgs } from './dto/create-mailing.args';
import { FindAllMailingWorkersDto } from './dto/find-all-mailing-workers.args';
import { UpdateMailingArgs } from './dto/update-mailing.args';
import { MailingWorker } from './entities/mailing-worker.entity';
import { Mailing } from './entities/mailing.entity';

@Injectable()
export class MailingService {
  constructor(@Inject(MAILINGS_SERVICE) private readonly client: ClientProxy) {}

  create(
    projectId: number,
    createMailingArgs: CreateMailingArgs,
  ): Observable<Mailing> {
    return this.client.send<Mailing>('createMailing', {
      projectId,
      ...createMailingArgs,
    });
  }

  findAll(projectId: number): Observable<Mailing[]> {
    return this.client.send<Mailing[]>('findAllMailings', {
      projectId,
    });
  }

  findOne(projectId: number, id: number): Observable<Mailing> {
    return this.client.send<Mailing>('findOneMailing', {
      projectId,
      id,
    });
  }

  update(
    projectId: number,
    updateMailingArgs: UpdateMailingArgs,
  ): Observable<Mailing> {
    return this.client.send<Mailing>('updateMailing', {
      projectId,
      ...updateMailingArgs,
    });
  }

  remove(projectId: number, id: number): Observable<Mailing> {
    return this.client.send<Mailing>('removeMailing', {
      projectId,
      id,
    });
  }

  findAllWorkers(
    projectId: number,
    findAllMailingWorkers: FindAllMailingWorkersDto,
  ): Observable<MailingWorker[]> {
    return this.client.send<MailingWorker[]>('findAllMailingWorkers', {
      projectId,
      ...findAllMailingWorkers,
    });
  }
}
