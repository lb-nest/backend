import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MESSAGING_SERVICE } from 'src/shared/rabbitmq/constants';
import { CreateChannelInput } from './dto/create-channel.input';
import { UpdateChannelInput } from './dto/update-channel.input';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    @Inject(MESSAGING_SERVICE) private readonly client: ClientProxy,
  ) {}

  async create(user: any, input: CreateChannelInput): Promise<Channel> {
    try {
      return await lastValueFrom(
        this.client.send('channels.create', {
          user,
          data: input,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll(user: any): Promise<Channel[]> {
    try {
      return await lastValueFrom(
        this.client.send('channels.findAll', {
          user,
          data: {},
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findOne(user: any, id: number): Promise<Channel> {
    try {
      return await lastValueFrom(
        this.client.send('channels.findOne', {
          user,
          data: id,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async update(user: any, input: UpdateChannelInput): Promise<Channel> {
    try {
      return await lastValueFrom(
        this.client.send('channels.update', {
          user,
          data: input,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(user: any, id: number): Promise<Channel> {
    try {
      return await lastValueFrom(
        this.client.send('channels.remove', {
          user,
          data: id,
        }),
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
