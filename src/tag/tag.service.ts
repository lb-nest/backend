import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CONTACTS_SERVICE } from 'src/shared/constants/broker';
import { CreateTagArgs } from './dto/create-tag.args';
import { UpdateTagArgs } from './dto/update-tag.args';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(@Inject(CONTACTS_SERVICE) private readonly client: ClientProxy) {}

  create(authorization: string, createTagArgs: CreateTagArgs): Observable<Tag> {
    return this.client.send<Tag>('tags.create', {
      headers: {
        authorization,
      },
      payload: createTagArgs,
    });
  }

  findAll(authorization: string): Observable<Tag[]> {
    return this.client.send<Tag[]>('tags.findAll', {
      headers: {
        authorization,
      },
      payload: null,
    });
  }

  findOne(authorization: string, id: number): Observable<Tag> {
    return this.client.send<Tag>('tags.findOne', {
      headers: {
        authorization,
      },
      payload: id,
    });
  }

  update(authorization: string, updateTagArgs: UpdateTagArgs): Observable<Tag> {
    return this.client.send<Tag>('tags.update', {
      headers: {
        authorization,
      },
      payload: updateTagArgs,
    });
  }

  remove(authorization: string, id: number): Observable<Tag> {
    return this.client.send<Tag>('tags.remove', {
      headers: {
        authorization,
      },
      payload: id,
    });
  }
}
