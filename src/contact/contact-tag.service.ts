import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CONTACTS_SERVICE } from 'src/shared/constants/broker';
import { TagWithoutParentAndChildren } from 'src/tag/entities/tag-without-parent-and-children.entity';

@Injectable()
export class ContactTagService {
  constructor(@Inject(CONTACTS_SERVICE) private readonly client: ClientProxy) {}

  create(
    projectId: number,
    contactId: number,
    tagId: number,
  ): Observable<TagWithoutParentAndChildren> {
    return this.client.send<TagWithoutParentAndChildren>('createContactTag', {
      projectId,
      contactId,
      tagId,
    });
  }

  findAll(
    projectId: number,
    contactId: number,
  ): Observable<TagWithoutParentAndChildren[]> {
    return this.client.send<TagWithoutParentAndChildren[]>(
      'findAllContactTags',
      {
        projectId,
        contactId,
      },
    );
  }

  remove(
    projectId: number,
    contactId: number,
    tagId: number,
  ): Observable<TagWithoutParentAndChildren> {
    return this.client.send<TagWithoutParentAndChildren>('removeContactTag', {
      projectId,
      contactId,
      tagId,
    });
  }
}
