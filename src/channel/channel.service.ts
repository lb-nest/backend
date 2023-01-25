import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MESSAGING_SERVICE } from 'src/shared/constants/broker';
import { CreateChannelArgs } from './dto/create-channel.args';
import { UpdateChannelArgs } from './dto/update-channel.args';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    @Inject(MESSAGING_SERVICE) private readonly client: ClientProxy,
  ) {}

  create(
    projectId: number,
    createChannelArgs: CreateChannelArgs,
  ): Observable<Channel> {
    return this.client.send<Channel>('createChannel', {
      projectId,
      ...createChannelArgs,
    });
  }

  findAll(projectId: number): Observable<Channel[]> {
    return this.client.send<Channel[]>('findAllChannels', {
      projectId,
    });
  }

  findOne(projectId: number, id: number): Observable<Channel> {
    return this.client.send<Channel>('findOneChannel', {
      projectId,
      id,
    });
  }

  update(
    projectId: number,
    updateChannelArgs: UpdateChannelArgs,
  ): Observable<Channel> {
    return this.client.send<Channel>('updateChannel', {
      projectId,
      ...updateChannelArgs,
    });
  }

  remove(projectId: number, id: number): Observable<Channel> {
    return this.client.send<Channel>('removeChannel', {
      projectId,
      id,
    });
  }
}
