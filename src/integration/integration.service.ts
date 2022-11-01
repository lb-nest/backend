import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { INTEGRATIONS_SERVICE } from 'src/shared/constants/broker';
import { CreateIntegrationArgs } from './dto/create-integration.args';
import { Integration } from './entities/integration.entity';

@Injectable()
export class IntegrationService {
  constructor(
    @Inject(INTEGRATIONS_SERVICE) private readonly client: ClientProxy,
  ) {}

  initialize(authorization: string): Observable<boolean> {
    return this.client.send('integrations.initialize', {
      headers: {
        authorization,
      },
    });
  }

  create(
    authorization: string,
    createIntegrationInput: CreateIntegrationArgs,
  ): Observable<Integration> {
    throw new NotImplementedException();
  }

  findAll(authorization: string): Observable<Integration[]> {
    throw new NotImplementedException();
  }

  findOne(authorization: string, id: string): Observable<Integration> {
    throw new NotImplementedException();
  }

  remove(authorization: string, id: string): Observable<Integration> {
    throw new NotImplementedException();
  }
}
