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

  create(projectId: number, createTagArgs: CreateTagArgs): Observable<Tag> {
    return this.client.send<Tag>('createTag', {
      projectId,
      ...createTagArgs,
    });
  }

  findAll(projectId: number): Observable<Tag[]> {
    return this.client.send<Tag[]>('findAllTags', {
      projectId,
    });
  }

  findOne(projectId: number, id: number): Observable<Tag> {
    return this.client.send<Tag>('findOneTag', {
      projectId,
      id,
    });
  }

  update(projectId: number, updateTagArgs: UpdateTagArgs): Observable<Tag> {
    return this.client.send<Tag>('updateTag', {
      projectId,
      ...updateTagArgs,
    });
  }

  remove(projectId: number, id: number): Observable<Tag> {
    return this.client.send<Tag>('removeTag', {
      projectId,
      id,
    });
  }
}
