import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma.service';
import {
  BILLING_SERVICE,
  INTEGRATIONS_SERVICE,
  MAILINGS_SERVICE,
} from 'src/shared/constants/broker';
import { InitializeFeatureArgs } from './dto/initialize-feature.args';
import { Feature } from './entities/feature.entity';

@Injectable()
export class FeatureService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(BILLING_SERVICE) private readonly billing: ClientProxy,
    @Inject(INTEGRATIONS_SERVICE) private readonly integrations: ClientProxy,
    @Inject(MAILINGS_SERVICE) private readonly mailings: ClientProxy,
  ) {}

  async initializeForProject(
    authorization: string,
    initializeFeatureArgs: InitializeFeatureArgs,
  ): Promise<Feature> {
    const features: Array<Promise<any>> = [];

    if (initializeFeatureArgs.billing) {
      features.push(
        lastValueFrom(
          this.billing.send('billing.initialize', {
            headers: {
              authorization,
            },
          }),
        ),
      );
    }

    if (initializeFeatureArgs.integrations) {
      features.push(
        lastValueFrom(
          this.integrations.send('integrations.initialize', {
            headers: {
              authorization,
            },
          }),
        ),
      );
    }

    if (initializeFeatureArgs.mailings) {
      features.push(
        lastValueFrom(
          this.mailings.send('mailings.initialize', {
            headers: {
              authorization,
            },
          }),
        ),
      );
    }

    await Promise.all(features);

    return this.prismaService.project.update({
      where: {
        id: initializeFeatureArgs.id,
      },
      data: InitializeFeatureArgs,
    });
  }

  findForProject(id: number): Promise<Feature> {
    return this.prismaService.project.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }
}
