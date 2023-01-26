import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { INTEGRATIONS_SERVICE } from 'src/shared/constants/broker';
import { CreateIntegrationArgs } from './dto/create-integration.args';
import { UpdateIntegrationArgs } from './dto/update-integration.args';
import { Integration } from './entities/integration.entity';

@Injectable()
export class IntegrationService {
  constructor(
    @Inject(INTEGRATIONS_SERVICE) private readonly client: ClientProxy,
  ) {}

  create(
    projectId: number,
    createIntegrationArgs: CreateIntegrationArgs,
  ): Observable<Integration> {
    return this.client.send<Integration>('createIntegration', {
      projectId,
      ...createIntegrationArgs,
    });
  }

  findAll(projectId: number): Observable<Integration[]> {
    return this.client.send<Integration[]>('findAllIntegrations', {
      projectId,
    });
  }

  findOne(projectId: number, id: string): Observable<Integration> {
    return this.client.send<Integration>('findOneIntegration', {
      projectId,
      id,
    });
  }

  update(
    projectId: number,
    updateIntegrationArgs: UpdateIntegrationArgs,
  ): Observable<Integration> {
    return this.client.send<Integration>('updateIntegration', {
      projectId,
      ...updateIntegrationArgs,
    });
  }

  remove(projectId: number, id: string): Observable<Integration> {
    return this.client.send<Integration>('removeIntegration', {
      projectId,
      id,
    });
  }
}
