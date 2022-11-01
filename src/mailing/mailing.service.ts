import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MAILINGS_SERVICE } from 'src/shared/constants/broker';
import { CreateMailingArgs } from './dto/create-mailing.args';
import { UpdateMailingArgs } from './dto/update-mailing.args';
import { Mailing } from './entities/mailing.entity';

@Injectable()
export class MailingService {
  constructor(@Inject(MAILINGS_SERVICE) private readonly client: ClientProxy) {}

  initialize(authorization: string): Observable<boolean> {
    return this.client.send('mailings.initialize', {
      headers: {
        authorization,
      },
    });
  }

  create(
    authorization: string,
    createMailingArgs: CreateMailingArgs,
  ): Observable<Mailing> {
    throw new NotImplementedException();
  }

  findAll(authorization: string): Observable<Mailing[]> {
    throw new NotImplementedException();
  }

  findOne(authorization: string, id: number): Observable<Mailing> {
    throw new NotImplementedException();
  }

  update(
    authorization: string,
    updateMailingArgs: UpdateMailingArgs,
  ): Observable<Mailing> {
    throw new NotImplementedException();
  }

  remove(authorization: string, id: number): Observable<Mailing> {
    throw new NotImplementedException();
  }
}
