import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MESSAGING_SERVICE } from 'src/shared/rabbitmq/constants';
import { CreateChannelArgs } from './dto/create-channel.args';
import { UpdateChannelArgs } from './dto/update-channel.args';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    @Inject(MESSAGING_SERVICE) private readonly client: ClientProxy,
  ) {}

  create(authorization: string, args: CreateChannelArgs): Observable<Channel> {
    return this.client.send<Channel>('channels.create', {
      headers: {
        authorization,
      },
      payload: args,
    });
  }

  findAll(authorization: string): Observable<Channel[]> {
    return this.client.send<Channel[]>('channels.findAll', {
      headers: {
        authorization,
      },
      payload: null,
    });
  }

  findOne(authorization: string, id: number): Observable<Channel> {
    return this.client.send<Channel>('channels.findOne', {
      headers: {
        authorization,
      },
      payload: id,
    });
  }

  update(authorization: string, args: UpdateChannelArgs): Observable<Channel> {
    return this.client.send<Channel>('channels.update', {
      headers: {
        authorization,
      },
      payload: args,
    });
  }

  remove(authorization: string, id: number): Observable<Channel> {
    return this.client.send<Channel>('channels.remove', {
      headers: {
        authorization,
      },
      payload: id,
    });
  }
}
