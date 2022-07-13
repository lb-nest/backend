import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MESSAGING_SERVICE } from 'src/shared/rabbitmq/constants';
import { CreateHsmInput } from './dto/create-hsm.input';
import { UpdateHsmInput } from './dto/update-hsm.input';
import { Hsm } from './entities/hsm.entity';

@Injectable()
export class HsmService {
  constructor(
    @Inject(MESSAGING_SERVICE) private readonly client: ClientProxy,
  ) {}

  async create(user: any, input: CreateHsmInput): Promise<Hsm> {
    try {
      return await lastValueFrom(
        this.client.send('hsm.create', {
          user,
          data: input,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll(user: any): Promise<Hsm[]> {
    try {
      return await lastValueFrom(
        this.client.send<any[]>('hsm.findAll', {
          user,
          data: {},
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findOne(user: any, id: number): Promise<Hsm> {
    try {
      return await lastValueFrom(
        this.client.send('hsm.findOne', {
          user,
          data: id,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async update(user: any, input: UpdateHsmInput): Promise<Hsm> {
    try {
      return await lastValueFrom(
        this.client.send('hsm.update', {
          user,
          data: input,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(user: any, id: number): Promise<Hsm> {
    try {
      return await lastValueFrom(
        this.client.send('hsm.remove', {
          user,
          data: id,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
